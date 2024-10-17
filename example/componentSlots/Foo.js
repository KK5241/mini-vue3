import { h } from "../../lib/mini-vue.esm.js";
import { renderSlots } from "../../lib/mini-vue.esm.js";
import { getCurrentInstance } from '../../lib/mini-vue.esm.js'
//实现三种类型的插槽
// 1. 默认插槽
// 2. 具名插槽  将slots改变为对象，在使用普通插槽的同时传入一个key
// 3. 作用域插槽 作用域插槽的话 因为涉及到传值，所以我们需要将key的value设计为一个函数
export const Foo = {
    name:'Foo',
    render(){
        const foo = h('p', {}, 'foo')
        const count1 = 10
        return h('div', {}, [renderSlots(this.$slots, 'header', {count1}), foo, renderSlots(this.$slots, 'footer')])
    },
    setup(props){
        const instance = getCurrentInstance()
        console.log('foo',instance);
        console.log(props);
    }
}