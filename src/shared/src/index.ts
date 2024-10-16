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
/**
 * 将name的首字母大写
 * @param name 
 * @returns 
 */
const capitalize = (name) => {
  return name[0].toLocaleUpperCase() + name.slice(1);
};
/**
 * 将sum-add 变为 sumAdd
 * @param name 
 * @returns 
 */
export const camelize = (name) => {
  return name.replace(/-(\w)/g, (_, c) => {
    return c ? c.toLocaleUpperCase() : "";
  });
};
/**
 * 将name首字母大写并再前面添加on
 */
export const covertWord = (name) => {
  return "on" + capitalize(name);
};