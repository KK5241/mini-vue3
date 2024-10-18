import { getCurrentInstance } from "./component";

export function provide(key, value) {
  const instance: any = getCurrentInstance();
  const parentProvides = instance.parent?.provides;

  // 这里判断是看是不是第一次使用provide 如果第一次使用那么就需要将当前组件的provides的原型指向父组件的原型
  // 如果不是第一次使用provide 那么直接修改即可
  if (instance.provides === parentProvides) {
    // 通过原型链的方式实现一直向上取值
    instance.provides = Object.create(parentProvides);
  }
  instance.provides[key] = value;
}

export function inject(key,defaultValue) {
  const instance: any = getCurrentInstance();

  const { parent } = instance;

  const provides = parent.provides ? parent.provides : {};

  if(key in provides){
    return provides[key];
  }else if(defaultValue){
    if(typeof defaultValue === 'function'){
        return defaultValue()
    }
    return defaultValue
  }
 
}
