let activeEffect; //effect辅助函数
let shouldTrack; //是否收集依赖

//effect 和 ReactiveEffect 都用来实现依赖收集逻辑
export class ReactiveEffect {
  arr = [];
  active = true; // 避免多次调用stop后重复运行代码
  constructor(public fn, public scheduler?) {}
  run() {
    if (!this.active) return this.fn();

    shouldTrack = true;
    activeEffect = this; //为什么传整个实例，而不是只传一个数组，通过后面需要scheduler可知，传实例的话更容易拿到scheduler
    const res = this.fn();
    shouldTrack = false
    return res;
  }
  stop() {
    if (this.active) {
      cleanEffect(this);
      this.active = false;
    }
  }
}

function cleanEffect(effect) {
  effect.arr.forEach((dep: any) => {
    dep.delete(effect);
  });
}

export function isTracking(){
  return shouldTrack && activeEffect
}
let depsMap = new WeakMap();
//依赖收集函数
export const track = function (target, key) {
  if(!isTracking()) return 

  let deps = depsMap.get(target);
  if (!deps) depsMap.set(target, (deps = new Map()));
  let dep = deps.get(key);
  if (!dep) deps.set(key, (dep = new Set()));
 
  //对响应式变量收集依赖函数 并对依赖函数收集dep
  trackEffects(dep)
};

export function trackEffects(dep){
  if(!dep.has(activeEffect)){
    dep.add(activeEffect);
    activeEffect.arr.push(dep);
  }
}
//派发更新函数
export const trigger = function (target, key) {
  const deps = depsMap.get(target);
  if (!deps) return;
  const dep = deps.get(key);
  if (!dep) return;
  
  //遍历dep触发依赖函数
  triggerEffects(dep)
};

export function triggerEffects(dep){
  dep.forEach((element) => {
    if (element.scheduler) {
      element.scheduler();
    } else {
      element.run();
    }
  });
}

export const effect = function (fn, options: any = {}) {
  const scheduler = options.scheduler;
  const _effect = new ReactiveEffect(fn, scheduler);

  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  //返回的函数添加当前实例属性，方便根据返回的函数找到对应的实例 方便stop操作
  runner._effect = _effect;

  // activeEffect = undefined

  return runner;
};

export const stop = function (runner) {
  runner._effect.stop();
};
