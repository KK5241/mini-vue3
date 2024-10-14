const publicePropertiesMap = {
    $el:(i)=>i.vNode.el
}
export const publiceInstanceProxyHandlers = {
  get({_:instance}, key) {
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }
    
    const publiceGetter = publicePropertiesMap[key]
    if(publiceGetter) return publiceGetter(instance)
  },
};
