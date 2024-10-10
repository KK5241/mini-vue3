import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

function createGetter(isReadonly = false) {
  return function get(target, key) {
    //判断是不是reactive
    if(key === ReactiveFlags.IS_REACTIVE){
        return !isReadonly
    }
    //判断是不是readonly
    if(key === ReactiveFlags.IS_READONLY){
        return isReadonly
    }
    //依赖收集
    if (!isReadonly) track(target, key);
    return target[key];
  };
}
function createSetter() {
  return function set(target, key, value) {
    target[key] = value;
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
