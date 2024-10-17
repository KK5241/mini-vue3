import { ShapeFlags } from "../shared/src/shapeFlags";

export function createVNode(type, props?, children?) {
  const vNode = {
    type,
    props,
    children,
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
