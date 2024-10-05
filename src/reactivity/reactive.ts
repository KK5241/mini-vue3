import { track, trigger } from "./effect";

export function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      //依赖收集
      track(target, key);
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      //派发更新
      trigger(target,key)
      return true;
    },
  });
}
