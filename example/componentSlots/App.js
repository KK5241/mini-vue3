import {
    h
} from '../../lib/mini-vue.esm.js'
import {
    Foo
} from './Foo.js'
import { createTextVNode } from '../../lib/mini-vue.esm.js'
import { getCurrentInstance } from '../../lib/mini-vue.esm.js'
window.self = null
export const App = {
    name:'App',
    render() {
        window.self = this
        //这里是给 h 函数传递参数，参数中的this使用的时render的this，render中的this会在调用的时候绑定
        return h('div', {id: 'root'}, [
            h('h1', {}, [h('h1',{},'123')]),
            h(Foo, {count: 1}, {
                header:({count1}) => h('p', {}, 'header' + count1),
                footer:() => [h('p', {}, 'footer'),createTextVNode('mmm')]
                //默认插槽 应该是自动将其添加到defalut键中
            })
        ])
    },

    setup() {
        // getCurrentInstance 只能在setup中被调用，返回当前组件的实例
        const instance = getCurrentInstance()
        console.log('app',instance);
        return {
            msg: 'mini-vue!~!'
        }
    }
}