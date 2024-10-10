import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

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

function createProxyObj(obj, basehandlers){
  return new Proxy(obj, basehandlers);
}

export function isReactive(obj){
  return !!obj[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(obj){
  return !!obj[ReactiveFlags.IS_READONLY]
}