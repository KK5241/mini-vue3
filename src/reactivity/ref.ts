import { hasChange, isObject } from "../shared/src";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

export class RefImpl {
  private _value;
  private _dep;
  private _rawValue
  constructor(value) {
    this._rawValue = value
    // ref 本身只能对value属性进行响应式的拦截操作 所以这里将value中的对象转化为reactive 从而实现深度响应式拦截
    this._value = conver(value)
    this._dep = new Set();
  }

  get value() {
    if (isTracking()) {
      trackEffects(this._dep);
    }
    return this._value;
  }

  set value(newValue) {
    if(hasChange(newValue,this._rawValue)) return 
    this._rawValue = newValue
    this._value = conver(newValue)
    triggerEffects(this._dep)
  }
}

function conver(value){
    return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
  return new RefImpl(value);
}
