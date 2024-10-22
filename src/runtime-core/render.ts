import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared/src";
import { ShapeFlags } from "../shared/src/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { FRAGMENT, TEXT } from "./createVNode";

export function createRenderer(options) {
  const {
    createElement: hostcreateElement,
    patchProps: hostpatchProps,
    insert: hostinsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vNode, container) {
    patch(null, vNode, container, null, null);
  }
  function patch(n1, n2, container, parentComponent, anchor) {
    //存在两种可能 一种是组件  一种是element元素
    //添加其他可能出现的情况
    // 1. 当是纯文本节点时  processText
    // 2. 去掉每个slot外面套的div标签 processFragment
    switch (n2.type) {
      case FRAGMENT:
        processFragment(n1, n2, container, parentComponent, anchor);
        break;
      case TEXT:
        processText(n1, n2, container);
        break;
      default:
        const { shapeFlag } = n2;
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor);
        }
        break;
    }
  }
  function processFragment(n1, n2, container, parentComponent, anchor) {
    mountFragment(n1, n2, container, parentComponent, anchor);
  }

  function mountFragment(n1, n2, container, parentComponent, anchor) {
    mountChildren(n2.children, container, parentComponent, anchor);
  }

  function processText(n1, n2, container) {
    mountText(n1, n2, container);
  }

  function mountText(n1, n2, container) {
    const el = (n2.el = document.createTextNode(n2.children));
    container.append(el);
  }

  function processElement(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      // init
      mountElement(n1, n2, container, parentComponent, anchor);
    } else {
      //update
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }
  // 更新
  function patchElement(n1, n2, container, parentComponent, anchor) {
    const prevProps = n1.props || EMPTY_OBJ;
    const nextProps = n2.props || EMPTY_OBJ;

    const el = (n2.el = n1.el);

    //children
    patchChildren(n1, n2, container, parentComponent, anchor);
    //props
    patchProps(el, prevProps, nextProps);
  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const prevShapeFlag = n1.shapeFlag;
    const nextShapeFlag = n2.shapeFlag;
    const c1 = n1.children;
    const c2 = n2.children;
    const el = n1.el;

    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unMountElement(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(el, c2);
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, "");
        mountChildren(c2, el, parentComponent, anchor);
      } else {
        patchKeyedChild(c1, c2, el, parentComponent, anchor);
      }
    }
  }
  function patchKeyedChild(c1, c2, container, parentComponent, anchor) {
    let e1 = c1.length - 1;
    let i = 0,
      e2 = c2.length - 1;

    function isSameVNodeType(n1, n2) {
      // 当两个节点的标签类型以及键相同时认为时相同的
      return n1.type === n2.type && n1.key === n2.key;
    }

    // 确定 i 的位置
    while (i <= e1 && i <= e2) {
      let n1 = c1[i];
      let n2 = c2[i];

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, anchor);
      } else {
        break;
      }

      i++;
    }

    // 确定e1 和 e2 的位置
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, anchor);
      } else {
        break;
      }

      e1--;
      e2--;
    }

    // 处理 情况一 和 情况二
    if (i > e1 && i <= e2) {
      while (i <= e2) {
        const vnode = c2[i];
        // 找到锚点 利用insertBefore实现前插
        const anchor = e2 + 1 < c2.length ? c2[e2 + 1].el : null;
        patch(null, vnode, container, parentComponent, anchor);
        i++;
      }
    } else if (i > e2 && i <= e1) {
      //处理情况三 和 情况四
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      //处理情况五
      let s1 = i;
      let s2 = i;
      let l2 = e2 - s2 + 1;
      let count = 0;
      // 记录每次旧节点映射的新节点下标的最大值，判断是不是一直递增
      let maxNewIndexSoFar = -10;
      // true 表示有节点需要移动  false表示无节点需要移动
      let moved = false;
      // 将新节点中间部分记录到map表中，方便后面查看旧节点是否在新节点中
      let keyToNewIndexMap = new Map();
      let newIndexToOldIndexSequence = new Array(l2).fill(0);
      for (let i = s2; i <= e2; i++) {
        keyToNewIndexMap.set(c2[i].key, i);
      }

      let newIndex;
      for (let i = s1; i <= e1; i++) {
        const prevVNode = c1[i];

        if (count >= l2) {
          hostRemove(prevVNode.el);
          continue;
        }

        if (prevVNode.key !== null) {
          newIndex = keyToNewIndexMap.get(prevVNode.key);
        } else {
          for (let j = s2; j <= e2; j++) {
            if (isSameVNodeType(prevVNode, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }

        // newIndex 如果是undefined则说明 在新的dom中未找到该节点，执行删除操作
        // 如果有值，则说明找到的相同节点，利用patch更新差异就可以了
        if (newIndex === undefined) {
          hostRemove(prevVNode.el);
        } else {
          if (maxNewIndexSoFar < newIndex) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          newIndexToOldIndexSequence[newIndex - s2] = i + 1;
          patch(prevVNode, c2[newIndex], container, parentComponent, null);
          count++;
        }
      }
      debugger
      // 根据旧DOM中稳定的序列，生成新DOM的最长递增子序列
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexSequence)
        : [];
      // 最长递增子序列的指针
      let increasingSequenceIndex = increasingNewIndexSequence.length - 1;

      // 遍历新DOM 中间部分，跟最长递增子序列去匹配，如果存在则表示当前节点是一个稳定的序列不需要操作，如果不存在则移动
      for (let i = l2 - 1; i >= 0; i--) {
        const nextIndex = i + s2;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null;

        // == 0  表示这个节点在旧DOM中是没有的需要调用patch创建
        if (newIndexToOldIndexSequence[i] === 0) {
          console.log(123);
          
          patch(null, nextChild, container, parentComponent, anchor);
        } else if (moved) {
          if (i !== increasingNewIndexSequence[increasingSequenceIndex]) {
            hostinsert(nextChild.el, container, anchor);
          } else {
            increasingSequenceIndex--;
          }
        }
      }
    }
  }

  function patchProps(el, prevProps, nextProps) {
    for (const key in nextProps) {
      if (nextProps[key] !== prevProps[key]) {
        hostpatchProps(el, key, prevProps[key], nextProps[key]);
      }
    }

    if (prevProps !== EMPTY_OBJ) {
      for (const key in prevProps) {
        if (!(key in nextProps)) {
          el.removeAttribute(key);
        }
      }
    }
  }

  function unMountElement(children) {
    children.forEach((item) => {
      hostRemove(item.el);
    });
  }
  //初始化
  function mountElement(n1, n2, container, parentComponent, anchor) {
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
      mountChildren(n2.children, el, parentComponent, anchor);
    }
    hostinsert(el, container, anchor);
  }

  function processComponent(n1, n2, container, parentComponent, anchor) {
    mountComponent(n2, container, parentComponent, anchor);
  }

  function mountComponent(vNode, container, parentComponent, anchor) {
    const instance = createComponentInstance(vNode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, vNode, container, anchor);
  }

  function setupRenderEffect(instance, vNode, container, anchor) {
    effect(() => {
      if (!instance.isMounted) {
        // render第一次调用 也就是初始化
        const { proxy } = instance;
        // instance.subTree 记录当前虚拟DOM
        const subTree = (instance.subTree = instance.render.call(proxy));
        //递归调用patch进一步操作组件内的元素
        patch(null, subTree, container, instance, null);
        //subTree 是组件第一次拆箱的结果 也就是根元素的虚拟DOM
        //这里是将组件的 el 绑定为根元素的 el
        vNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        // 响应式数据触发 新旧节点更新 重新触发render函数进行重渲染
        const { proxy } = instance;
        const prevSubTree = instance.subTree;
        const subTree = (instance.subTree = instance.render.call(proxy));
        console.log("subTree", subTree);
        console.log("prevSubTree", prevSubTree);

        // 更新的patch操作
        patch(prevSubTree, subTree, container, instance, anchor);
      }
    });
  }

  //处理elementVnode中child为数组的情况
  function mountChildren(
    newChild: any,
    container: any,
    parentComponent,
    anchor
  ) {
    newChild.forEach((vnode) => {
      patch(null, vnode, container, parentComponent, anchor);
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}

//最长递增子序列
function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
