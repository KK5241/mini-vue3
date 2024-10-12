import { ReactiveEffect } from "./effect";

export class ComputedRefImpl {
  private _getter: any;
  private _dirty: any;
  private _value: any;
  constructor(getter) {
    //这里将getter转化为effect 目的时为了收集getter和其中响应式数据的依赖关系
    //这里我们知道computed是懒执行的，所以需要一个调度器来打开开关，下次获取computed的值时再执行getter函数
    this._getter = new ReactiveEffect(getter, () => {
      if (!this._dirty) this._dirty = true;
    });
    this._dirty = true;
  }

  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._getter.run();
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}
