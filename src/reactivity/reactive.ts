import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers";

export enum ReactiveFlags {
  IS_REACTIVE = '_is_reactive',
  IS_READONLY = '_is_readonly'
}
export function reactive(obj) {
  return createProxyObj(obj,mutableHandlers)
}


export function readonly(obj){
  return createProxyObj(obj,readonlyHandlers)
}
export function shallowReadonly(obj){
  return createProxyObj(obj,shallowReadonlyHandlers)
}

function createProxyObj(obj, basehandlers){
  return new Proxy(obj, basehandlers);
}

export function isReactive(obj){
  return !!obj[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(obj){
  return !!obj[ReactiveFlags.IS_READONLY]
}

export function isProxy(obj){
  return isReactive(obj) || isReadonly(obj)
}