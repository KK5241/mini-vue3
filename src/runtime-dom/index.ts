import { createRenderer } from "../runtime-core/render";

function createElement(type) {
  return document.createElement(type);
}

export function patchProps(el, key, preVal, nextVal) {
  const isMatch = /^on[A-Z]/.test(key);
  if (isMatch) {
    const transformEvent = key.slice(2).toLocaleLowerCase();
    el.addEventListener(transformEvent, nextVal);
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}
function remove(children) {
  const parent = children.parentNode
  parent.removeChild(children);
}
function insert(el, parent, anchor) {
  parent.insertBefore(el, anchor);
}
function setElementText(el, text) {
  el.textContent = text;
}
const render: any = createRenderer({
  insert,
  patchProps,
  createElement,
  remove,
  setElementText,
});

//真正使用的render在这里导出
export function createApp(...args) {
  return render.createApp(...args);
}

// 因为dom依赖于core所以一般我们会把被依赖项放入依赖项中导出
export * from "../runtime-core";
