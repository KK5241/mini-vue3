import { createVNode } from "./createVNode";
//因为这里createApp依赖于render，所以我们在构建自定义渲染器的时候要想办法将render传给createApp
//这里我们可以使用闭包，调用外层函数传入render，返回一个可以使用到render的createApp

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        //所有的组件处理都需要先转化为虚拟节点
        const vNode = createVNode(rootComponent);
        render(vNode, rootContainer);
      },
    };
  }
}
