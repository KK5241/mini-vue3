import {
    getCurrentInstance,
    h,
    nextTick
} from '../../lib/mini-vue.esm.js'
import {
    ref
} from '../../lib/mini-vue.esm.js'
export const App = {
    render() {
        console.log(this.val);

        return h('div', {}, [
            h('div', {}, String(this.val)),
            h('button', {
                onClick: this.add
            }, '点我增加')
        ])

    },

    setup() {
        let val = ref(1)
        const instance = getCurrentInstance()
        const add = () => {
            for (let i = 0; i < 99; i++) {
                val.value += 1
            }
            nextTick(() => {
                console.log('123', instance);
            })
        }
        return {
            val,
            add
        }
    }
}