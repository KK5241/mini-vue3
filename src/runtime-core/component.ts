export function createComponentInstance(vNode) {
  const component = {
    vNode,
    type: vNode.type,
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
