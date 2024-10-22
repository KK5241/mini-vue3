import {
    h
} from "../../lib/mini-vue.esm.js"
import {
    ref
} from '../../lib/mini-vue.esm.js'

const oldText = 'old-child'
const newText = 'new-child'
export const textToText = {
    name: 'arraytotext',
    render() {
        return h('div', {}, this.isChange === true ? newText : oldText)
    },

    setup() {
        const isChange = ref(false)
        window.isChange = isChange
        return {
            isChange
        }
    },
}