import {
    h
} from '../../lib/mini-vue.esm.js'
import { ref } from '../../lib/mini-vue.esm.js'
export const App = {
    render() {
        // 这里我们直接使用this.count 发现结果时一个对象，因为ref数据包裹在value中，这里就需要proxyRef进行解构
        return h('div', {}, [h('p', {}, 'count:' + this.count), h('button', {
            onClick: this.add
        }, '加1')])
    },

    setup() {

        const count = ref(0)
        const add = () => {
            count.value++
        }

        return {
            count,
            add
        }
    }
}