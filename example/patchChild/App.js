import {
    createTextVNode,
    h
} from '../../lib/mini-vue.esm.js'
import { arrayToArray } from './arrayToArray.js'

import { arrayToText } from './arrayToText.js'
import { textToArray } from './textToArray.js'
import { textToText } from './textToText.js'
export const App = {
    render() {
        return h('div',{},[
            createTextVNode('主页'),
            h(arrayToArray)
        ])
    },

    setup() {
       
    }
}