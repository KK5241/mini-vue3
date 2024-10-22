import { ShapeFlags } from "../shared/src/shapeFlags";

export const FRAGMENT = 'Fragment'
export const TEXT = 'text'

export function createVNode(type, props?, children?) {
  const vNode = {
    type,
    props,
    children,
    key:props && props.key, // prop的key绑定在这里方便后续diff算法的比较
    shapeFlag: getShapeFlag(type),
    el: null,
  };

  if(typeof children === 'string'){
    vNode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }else if(Array.isArray(children)){
    vNode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  if(vNode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
    if(typeof vNode.children === 'object'){
      vNode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }
  return vNode 
}
function getShapeFlag(type: any) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}

// 创建一个纯文本的vnode
export function createTextVNode(text){
  return createVNode(TEXT,{},text)
}