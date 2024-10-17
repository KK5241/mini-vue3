import { createVNode } from "../createVNode";

export function renderSlots(slots, key, props) {
    const val = slots[key]
    
    if(typeof val === 'function'){
        return createVNode("div", {}, val(props));
    }

}
