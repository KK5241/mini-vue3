class ReactiveEffect {
  constructor(public fn) {}
  run() {
    activeEffecr = this
    this.fn();
  }
}

let depsMap = new WeakMap();
//依赖收集函数
export const track = function (target, key) {
  let deps = depsMap.get(target);
  if (!deps) depsMap.set(target, (deps = new Map()));
  let dep = deps.get(key);
  if (!dep) deps.set(key, (dep = new Set()));
  dep.add(activeEffecr)
};
//派发更新函数
export const trigger = function (target, key) {
    const deps = depsMap.get(target)
    if(!deps) return 
    const dep = deps.get(key)
    if(!dep) return 
    dep.forEach(element => {
        element.run()
    });
};

//effect辅助函数
let activeEffecr
export const effect = function (fn) {
  const _effect = new ReactiveEffect(fn);

  _effect.run();
};
