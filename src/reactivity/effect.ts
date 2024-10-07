class ReactiveEffect {
  arr = []
  constructor(public fn, public scheduler?) {}
  run() {
    activeEffect = this; //为什么传整个实例，而不是只传一个数组，通过后面需要scheduler可知，传实例的话更容易拿到scheduler
    const res = this.fn();
    return res;
  }
  stop(){
    console.log(this.arr);
    this.arr.forEach((dep:any)=>{
      dep.delete(this)
    })
  }
}

let depsMap = new WeakMap();
//依赖收集函数
export const track = function (target, key) {
  let deps = depsMap.get(target);
  if (!deps) depsMap.set(target, (deps = new Map()));
  let dep = deps.get(key);
  if (!dep) deps.set(key, (dep = new Set()));
  if(!activeEffect) return
  dep.add(activeEffect);
  activeEffect.arr.push(dep)
};
//派发更新函数
export const trigger = function (target, key) {
  const deps = depsMap.get(target);
  if (!deps) return;
  const dep = deps.get(key);
  if (!dep) return;
  dep.forEach((element) => {
    if(element.scheduler){
        element.scheduler()
    }else{
        element.run();
    }
  });
};

//effect辅助函数
let activeEffect;
export const effect = function (fn, options: any = {}) {
  const scheduler = options.scheduler;
  const _effect = new ReactiveEffect(fn,scheduler);

  _effect.run();
  
  const runner:any = _effect.run.bind(_effect);
  //返回的函数添加当前实例属性，方便根据返回的函数找到对应的实例 方便stop操作
  runner._effect = _effect
   
  // activeEffect = undefined

  return runner
};

export const stop = function(runner){
  runner._effect.stop()
}
