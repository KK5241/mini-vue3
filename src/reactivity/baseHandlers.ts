import { isObject } from "../shared/src";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    //判断是不是reactive  isReactive API
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    }
    //判断是不是readonly isReadonly API
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const res = Reflect.get(target,key);
    if(shallow) return res
    //依赖收集
    if (!isReadonly) track(target, key);

    if (isObject(res)) return isReadonly ? readonly(res) : reactive(res); //做深度响应式处理
    return res;
  };
}
function createSetter() {
  return function set(target, key, value) {
    Reflect.set(target,key,value)
    //派发更新
    trigger(target, key);
    return true;
  };
}

export const mutableHandlers = {
  get: createGetter(), //复用相同的函数利用高阶函数来进行抽离
  set: createSetter(),
};
export const readonlyHandlers = {
  get: createGetter(true),
  set(target, key: any, value) {
    console.warn(`${key}是只读属性不允许被修改`);
    return true;
  },
};
export const shallowReadonlyHandlers = Object.assign({},readonlyHandlers,{
  get:createGetter(true,true),
})