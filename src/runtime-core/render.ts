import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared/src";
import { ShapeFlags } from "../shared/src/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { FRAGMENT, TEXT } from "./createVNode";

export function createRenderer(options) {
  const { createElement: hostcreateElement, patchProps: hostpatchProps, insert: hostinsert } = options;

  function render(vNode, container) {
    patch(null, vNode, container, null);
  }
  function patch(n1, n2, container, parentComponent) {
    //存在两种可能 一种是组件  一种是element元素
    //添加其他可能出现的情况
    // 1. 当是纯文本节点时  processText
    // 2. 去掉每个slot外面套的div标签 processFragment
    switch (n2.type) {
      case FRAGMENT:
        processFragment(n1, n2, container, parentComponent);
        break;
      case TEXT:
        processText(n1, n2, container);
        break;
      default:
        const { shapeFlag } = n2;
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }
  function processFragment(n1, n2, container, parentComponent) {
    mountFragment(n1, n2, container, parentComponent);
  }

  function mountFragment(n1, n2, container, parentComponent) {
    mountChildren(n1, n2, container, parentComponent);
  }

  function processText(n1, n2, container) {
    mountText(n1, n2, container);
  }

  function mountText(n1, n2, container) {
    const el = (n2.el = document.createTextNode(n2.children));
    container.append(el);
  }

  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      // init
      mountElement(n1, n2, container, parentComponent);
    } else {
      //update
      patchElement(n1, n2, container);
    }
  }
  // 更新
  function patchElement(n1, n2, container) {

    //children

    //props
    const prevProps = n1.props || EMPTY_OBJ;
    const nextProps = n2.props || EMPTY_OBJ;

    const el = (n2.el = n1.el);
    patchProps(el, prevProps, nextProps);
  }
  function patchProps(el, prevProps, nextProps) {

    for (const key in nextProps) {
      if (nextProps[key] !== prevProps[key]) {
        hostpatchProps(el, key, prevProps[key], nextProps[key]);
      }
    }

    if(prevProps !== EMPTY_OBJ){
      for (const key in prevProps) {
        if(!(key in nextProps)){
          el.removeAttribute(key)
        }
      }
    }
  }
  //初始化
  function mountElement(n1, n2, container, parentComponent) {
    // 递归遍历的时候为每个虚拟DOM 绑定当前的元素
    const el = (n2.el = hostcreateElement(n2.type));
    const { props, children, shapeFlag } = n2;

    //为真实DOM el设置属性
    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        const val = props[key];
        // 当props是注册事件时通过这种方式注册，利用小步骤思想，具体 -> 抽象
        // on + 事件名（这里的首字母要大写）
        //判断的时候可以用正则，处理的时候切割+转化小写
        // if (key === "onClick") {
        //   el.addEventListener("click", val);
        //}
        // const isMatch = /^on[A-Z]/.test(key);
        // if (isMatch) {
        //   const transformEvent = key.slice(2).toLocaleLowerCase();
        //   el.addEventListener(transformEvent, val);
        // } else {
        //   el.setAttribute(key, val);
        // }
        hostpatchProps(el, key, null, val);
      }
    }

    //children 只能是文本或者数组
    //children 如果是数组的话 数组里面必须是虚拟DOM不能是文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(n1, n2, el, parentComponent);
    }
    hostinsert(el, container);
  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  function mountComponent(vNode, container, parentComponent) {
    const instance = createComponentInstance(vNode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, vNode, container);
  }

  function setupRenderEffect(instance, vNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        // render第一次调用 也就是初始化
        const { proxy } = instance;
        // instance.subTree 记录当前虚拟DOM
        const subTree = (instance.subTree = instance.render.call(proxy));
        //递归调用patch进一步操作组件内的元素
        patch(null, subTree, container, instance);
        //subTree 是组件第一次拆箱的结果 也就是根元素的虚拟DOM
        //这里是将组件的 el 绑定为根元素的 el
        vNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        // 响应式数据触发 新旧节点更新 重新触发render函数进行重渲染
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSunTree = instance.subTree;

        console.log(subTree);
        console.log(prevSunTree);
        patch(prevSunTree, subTree, container, instance);
      }
    });
  }

  //处理elementVnode中child为数组的情况
  function mountChildren(n1, n2: any, container: any, parentComponent) {
    n2.children.forEach((vnode) => {
      patch(null, vnode, container, parentComponent);
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}
