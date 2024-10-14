import { publiceInstanceProxyHandlers } from "./componentPubliceInstance";

export function createComponentInstance(vNode) {
  const component = {
    vNode,
    type: vNode.type,
    setupState: {},
  };
  return component;
}

export function setupComponent(instance) {
  //TODO
  //initProps()
  //initSlots()

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const component = instance.vNode.type;

  const { setup } = component;

  //这里我们创建一个代理对象，并在调用 render 的时候将这个对象绑定给 this
  //目的：当我们在render中使用 this 的时候会触发这个代理，判断 this 的属性是否在 setup 当中，是的话就返回
  instance.proxy = new Proxy({ _: instance }, publiceInstanceProxyHandlers);

  if (setup) {
    //返回的结果有可能是Object 有可能是 Function
    const setupResult = setup();

    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render;
  }
}
