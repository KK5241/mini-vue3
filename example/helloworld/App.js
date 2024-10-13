import {
    h
} from '../../lib/mini-vue.esm.js'

export const App = {
    render() {
        return h('div', {
            id: 'root'
        }, [
            h('h1', {
                id: 'h1',
                class: 'red'
            }, '我是h1标签'),
            h('p', {
                id: 'p',
                class: 'blue'
            }, '我是p标签')
        ])
    },

    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}