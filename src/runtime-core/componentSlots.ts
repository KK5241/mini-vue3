import { ShapeFlags } from "../shared/src/shapeFlags";

export function initSlots(instance, slots) {
  const { vNode } = instance;

  if (vNode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    const slot = {};
    normolizeObj(slot, slots);
    instance.slots = slot;
  }

  // instance.slots = Array.isArray(slots) ? slots : [slots]
  // 初始话的时候要将每一个slot转化为数组，因为在element中children只接受文本和数组，虚拟dom要放到数组中
}

// 对每个插槽进行处理，将插槽的value外面在封装一层函数 方便做数组转化
function normolizeObj(slot, slots) {
  for (const key in slots) {
    const val = slots[key];
    slot[key] = (props) => normolieze(val(props));
  }
}

// 初始话的时候要将每一个slot转化为数组，因为在element中children只接受文本和数组，虚拟dom要放到数组中
// 也正是因为我们将每个slot转化为了数组 所以会导致直接写text报错的问题
function normolieze(val) {
  return Array.isArray(val) ? val : [val];
}
