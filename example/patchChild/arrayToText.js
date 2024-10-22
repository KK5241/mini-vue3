import {
    h
} from "../../lib/mini-vue.esm.js"
import {
    ref
} from '../../lib/mini-vue.esm.js'

const array = [h('div', {}, 'A'), h('div', {}, 'B')]
const text = 'new-child'
export const arrayToText = {
    name: 'arraytotext',
    render() {
        return h('div', {}, this.isChange === true ? text : array)
    },

    setup() {
        const isChange = ref(false)
        window.isChange = isChange
        return {
            isChange
        }
    },
}