import {
    createApp
} from "../../lib/mini-vue.esm.js"

import { provide, inject } from "../../lib/mini-vue.esm.js"

import { h } from '../../lib/mini-vue.esm.js'
const App = {
    name:'App',
    render() {
        return h('div', {}, [h('p', {}, 'app'), h(FooTwo)])
    },

    setup() {
        provide('m', 1)
        provide('n', 2)
    }
}

const FooTwo = {
    render(){
        return h('div',{},[h('p',{},'footwo'),h('p',{},`FooTwo--${this.m}`),h(Foo)])
    },
    setup(){
        provide('m',2)
        provide('n',3)
        const m = inject('m')
        return {
            m
        }
    }
}
const Foo = {
    name:'foo',
    render() {
        return h('div', {}, [h('p', {}, 'foo'), h('p', {}, `Foo--${this.m}--${this.n}--${this.x}--${this.y}--${this.p}`)])
    },

    setup() {
        const m = inject('m')
        const n = inject('n')
        const x = inject('x','x')
        const y = inject('m','m')
        const p = inject('p',()=>'p')
        return {
            m,
            n,
            x,
            y,
            p
        }
    }
}

const app = document.querySelector('#app')
createApp(App).mount(app)