import { hasOwn } from "../shared/src/index";

const publicePropertiesMap = {
    $el:(i)=>i.vNode.el,
    $slots:(i)=>i.slots,
    $props:(i)=>i.props
}
export const publiceInstanceProxyHandlers = {
  get({_:instance}, key) {
    const { setupState, props } = instance;
    if (hasOwn(setupState, key)) {
      return setupState[key];
    }else if(hasOwn(props,key)){
      return props[key]
    }
    
    const publiceGetter = publicePropertiesMap[key]
    if(publiceGetter) return publiceGetter(instance)
  },
};
