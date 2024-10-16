import { camelize, covertWord } from "../shared/src/index";

export function emit(instance, name, ...args) {
  
  // TDD思想，先写一个具体的再写整体
  const fn = instance.props[covertWord(camelize(name))];
  fn && fn(...args);
}
