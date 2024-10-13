import { createVNode } from "./createVNode";
import { render } from "./render";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      //所有的组件处理都需要先转化为虚拟节点
      const vNode = createVNode(rootComponent);
      render(vNode, rootContainer);
    },
  };
}
