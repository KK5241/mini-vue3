import {
    h
} from '../../lib/mini-vue.esm.js'

window.self = null
export const App = {
    render() {
        window.self = this
        //这里是给 h 函数传递参数，参数中的this使用的时render的this，render中的this会在调用的时候绑定
        return h('div', {
            id: 'root',
            onClick(){
                console.log('click');
            },
            onMousedown(){
                console.log('mouseDown');
            }
        }, [h('h1',{},'123')])
    },

    setup() {
        return {
            msg: 'mini-vue!~!'
        }
    }
}