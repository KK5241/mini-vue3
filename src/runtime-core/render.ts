import { isObject } from "../shared/src/index";
import { ShapeFlags } from "../shared/src/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vNode, container) {
  patch(vNode, container);
}
function patch(vNode, container) {
  //存在两种可能 一种是组件  一种是element元素
  const { shapeFlag } = vNode;
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vNode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vNode, container);
  }
}

function processElement(vNode, container) {
  // init
  mountElement(vNode, container);

  //update
}
function mountElement(vNode, container) {
  // 递归遍历的时候为每个虚拟DOM 绑定当前的元素
  const el = (vNode.el = document.createElement(vNode.type));
  const { props, children, shapeFlag } = vNode;

  //为真实DOM el设置属性
  setAttributes(el, props);
  
  //children 只能是文本或者数组
  //children 如果是数组的话 数组里面必须是虚拟DOM不能是文本
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vNode, el);
  }
  container.append(el);
}

function processComponent(vNode, container) {
  mountComponent(vNode, container);
}

function mountComponent(vNode, container) {
  const instance = createComponentInstance(vNode);

  setupComponent(instance);

  setupRenderEffect(instance, vNode, container);
}

function setupRenderEffect(instance, vNode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  //递归调用patch进一步操作组件内的元素
  patch(subTree, container);
  //subTree 是组件第一次拆箱的结果 也就是根元素的虚拟DOM
  //这里是将组件的 el 绑定为根元素的 el
  vNode.el = subTree.el;
}

//处理elementVnode中child为数组的情况
function mountChildren(vNode: any, container: any) {
  vNode.children.forEach((vnode) => {
    patch(vnode, container);
  });
}

function setAttributes(el: any, props: any) {
  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      const val = props[key];
      // 当props是注册事件时通过这种方式注册，利用小步骤思想，具体 -> 抽象
      // on + 事件名（这里的首字母要大写）
      //判断的时候可以用正则，处理的时候切割+转化小写 
      // if (key === "onClick") {
      //   el.addEventListener("click", val);
      //}
      const isMatch = /^on[A-Z]/.test(key)
      if(isMatch){
        const transformEvent = key.slice(2).toLocaleLowerCase()
        el.addEventListener(transformEvent,val)
      }else{
        el.setAttribute(key, val);
      }
    }
  }
}
