import {
    h
} from '../../lib/mini-vue.esm.js'
import {
    ref
} from '../../lib/mini-vue.esm.js'
import { Child } from './Child.js'
export const App = {
    render() {
        return h('div',{},[
            h('div',{},'你好'),
            h(Child,{
                msg:this.msg
            }),
            h('button',{onClick:this.modifyMsg},'点击修改props')
        ])
    },

    setup() {
        const msg = ref('123')
        const modifyMsg = () => {
            msg.value = '456'
        }

        return {
            msg,
            modifyMsg
        }
    }
}