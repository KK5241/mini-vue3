import { proxyRefs } from "../reactivity";
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./ComponentEmit";
import { initProps } from "./componentProps";
import { publiceInstanceProxyHandlers } from "./componentPubliceInstance";
import { initSlots } from "./componentSlots";

let currentInstance = null;
export function createComponentInstance(vNode, parentComponent) {
  const component = {
    vNode,
    type: vNode.type,
    props: {},
    slots: {},
    next:null,
    isMounted: false,
    subTree:{},
    parent: parentComponent,
    provides: parentComponent ? parentComponent.provides : {},
    setupState: {},
    emit: () => {},
  };
  return component;
}

export function setupComponent(instance) {
  //TODO
  const { props, children } = instance.vNode;
  initProps(instance, props);

  initSlots(instance, children);

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const component = instance.vNode.type;

  const { setup } = component;

  //这里我们创建一个代理对象，并在调用 render 的时候将这个对象绑定给 this
  //目的：当我们在render中使用 this 的时候会触发这个代理，判断 this 的属性是否在 setup 当中，是的话就返回
  instance.proxy = new Proxy({ _: instance }, publiceInstanceProxyHandlers);
  instance.emit = emit.bind(null, instance);

  if (setup) {
    //返回的结果有可能是Object 有可能是 Function

    //这里包装成函数的目的是为了断掉调试，如果直接赋值，出问题后不知道是哪里赋值出的问题，封装成函数之后所有的赋值都走函数
    //我们就可以通过打断点的方式来进行调试
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), instance);
    setCurrentInstance(null);

    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render;
  }
}

export function getCurrentInstance() {
  return currentInstance;
}

function setCurrentInstance(newInstance) {
  currentInstance = newInstance;
}
