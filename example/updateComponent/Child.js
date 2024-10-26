import {
    h
} from '../../lib/mini-vue.esm.js'

export const Child = {
    render() {
         return h('div',{},[h('div',{},this.$props.msg)])
    },
    setup(props) {
        
        return {
            
        }
    },
}