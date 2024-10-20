import {
    h
} from '../../lib/mini-vue.esm.js'
import {
    ref
} from '../../lib/mini-vue.esm.js'
export const App = {
    render() {
        // 这里我们直接使用this.count 发现结果时一个对象，因为ref数据包裹在value中，这里就需要proxyRef进行解构
        return h('div', {
            id: 'root',
            ...this.props
        }, [h('p', {}, 'count:' + this.count), h('button', {
            onClick: this.add
        }, '加1'), h('button', {
            onClick: this.modifyProps
        }, '修改foo的值'), h('button', {
            onClick: this.setPropsUndefined
        }, '将props的值设置为undefined'), h('button', {
            onClick: this.removeProps
        }, '移除属性')])
    },

    setup() {
        const count = ref(0)
        const add = () => {
            count.value++
        }
        const props = ref({
            foo: 'foo',
            bar: 'bar'
        })
        const modifyProps = () => {
            props.value.foo = 'new-foo'
        }
        const setPropsUndefined = () => {
            props.value.foo = undefined
        }
        const removeProps = () => {
            props.value = {
                foo: 'foo'
            }
        }
        return {
            count,
            add,
            props,
            modifyProps,
            setPropsUndefined,
            removeProps
        }
    }
}