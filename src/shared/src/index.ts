// 判断一个变量是不是对象
export function isObject(value) {
  return value !== null && typeof value === "object"
}

// 判断值是否发生改变
export function hasChange(newValue, oldValue) {
  return Object.is(newValue, oldValue);
}

// 判断某个对象自身是否包含某个key
export const hasOwn = (obj,key)=>{
  return Object.prototype.hasOwnProperty.call(obj,key)
}