import { createRenderer } from "../runtime-core/render";

function createElement(type) {
  return document.createElement(type);
}

function patchProps(el, key, val) {
  const isMatch = /^on[A-Z]/.test(key);
  if (isMatch) {
    const transformEvent = key.slice(2).toLocaleLowerCase();
    el.addEventListener(transformEvent, val);
  } else {
    el.setAttribute(key, val);
  }
}

function insert(el, parent) {
  parent.append(el);
}

const render:any = createRenderer({ insert, patchProps, createElement });

//真正使用的render在这里导出
export function createApp(...args){
    return render.createApp(...args)
}

// 因为dom依赖于core所以一般我们会把被依赖项放入依赖项中导出
export * from "../runtime-core"