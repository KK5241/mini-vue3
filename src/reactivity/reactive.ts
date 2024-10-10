import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export function reactive(obj) {
  return createProxyObj(obj,mutableHandlers)
}


export function readonly(obj){
  return createProxyObj(obj,readonlyHandlers)
}

function createProxyObj(obj, basehandlers){
  return new Proxy(obj, basehandlers);
}