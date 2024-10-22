import {
    h
} from "../../lib/mini-vue.esm.js"
import {
    ref
} from '../../lib/mini-vue.esm.js'

const text = 'old-children'
const array = [h('div', {}, 'A'), h('div', {}, 'B')]
export const textToArray = {
    name: 'arraytotext',
    render() {
        return h('div', {}, this.isChange === true ? array : text)
    },

    setup() {
        const isChange = ref(false)
        window.isChange = isChange
        return {
            isChange
        }
    },
}