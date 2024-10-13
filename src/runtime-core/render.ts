import { createComponentInstance, setupComponent } from "./component";

export function render(vNode, container) {
  patch(vNode, container);
}
function patch(vNode, container) {
  //存在两种可能 一种是组件  一种是element元素

  processComponent(vNode, container);
}
function processComponent(vNode, container) {
  mountComponent(vNode, container);
}
function mountComponent(vNode, container) {
    const instance = createComponentInstance(vNode)

    setupComponent(instance)

    setupRenderEffect(instance,container)
}
function setupRenderEffect(instance,container){
    const subTree = instance.render()
    //递归调用patch进一步操作组件内的元素
    patch(subTree,container)
}
