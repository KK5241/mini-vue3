import { isObject } from "../shared/src/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vNode, container) {
  patch(vNode, container);
}
function patch(vNode, container) {
  //存在两种可能 一种是组件  一种是element元素
  if (typeof vNode.type === "string") {
    processElement(vNode, container);
  } else if (isObject(vNode.type)) {
    processComponent(vNode, container);
  }
}

function processElement(vNode, container) {
  // init
  mountElement(vNode, container);

  //update
}
function mountElement(vNode, container) {
  const el = document.createElement(vNode.type);
  const { props, children } = vNode;

  //为真实DOM el设置属性
  setAttributes(el, props);

  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
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

  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render();
  //递归调用patch进一步操作组件内的元素
  patch(subTree, container);
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
      el.setAttribute(key, val);
    }
  }
}
