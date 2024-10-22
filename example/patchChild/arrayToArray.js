import {
    h
} from "../../lib/mini-vue.esm.js"
import {
    ref
} from '../../lib/mini-vue.esm.js'

// 情况一：新节点比旧节点长，增加节点在右侧

// const oldArray = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B')
// ]
// const newArray = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'),
//     h('div', {key:'C'}, 'C'),
//     h('div', {key:'D'}, 'D')
// ]

//情况二：新节点比旧节点长，增加节点在左侧

// const oldArray = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B')
// ]
// const newArray = [
//     h('div', {key:'C'}, 'C'),
//     h('div', {key:'D'}, 'D'),
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B')

// ]

//情况三：新节点比老节点短，删除节点在右侧
// const oldArray = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'),
//     h('div', {key:'C'}, 'C')
// ]
// const newArray = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B')

// ]

//情况四：新节点比老节点短，删除节点在左侧

// const oldArray = [
//     h('div', {key:'C'}, 'C'),
//     h('div', {key:'D'}, 'D'),
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B')

// ]
// const newArray = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B')

// ]

//情况五：中间复杂情况
// 五.1 删除中间节点，并修改节点属性
// const oldArray = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'),
//     h('div', {key:'C'}, 'C'),
//     h('div', {key:'D',id:'prev-props'}, 'D'),
//     h('div', {key:'F'}, 'F'),
//     h('div', {key:'G'}, 'G'),
//     h('div', {key:'E'}, 'E'),

// ]
// const newArray = [
//     h('div', {key:'A'}, 'A'),
//     h('div', {key:'D',id:'next-props'}, 'D'), 
//     h('div', {key:'C'}, 'C'),
//     h('div', {key:'B'}, 'B'),
//     h('div', {key:'E'}, 'E')
// ]

// 五.2 移动中间节点
// 移动
// const oldArray = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'),
//     h('div', {key:'C'}, 'C'),
//     h('div', {key:'D'}, 'D'),
//     h('div', {key:'E'}, 'E'),
//     h('div', {key:'F'}, 'F'),
//     h('div', {key:'G'}, 'G')

// ]
// const newArray = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'),
//     h('div', {key:'E'}, 'E'),
//     h('div', {key:'C'}, 'C'),
//     h('div', {key:'D'}, 'D'),
//     h('div', {key:'F'}, 'F'),
//     h('div', {key:'G'}, 'G')
// ]

// 移动 + 创建
// const oldArray = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'),
//     h('div', {key:'C'}, 'C'),
//     h('div', {key:'D'}, 'D'),
//     h('div', {key:'E'}, 'E'),
//     h('div', {key:'F'}, 'F'),
//     h('div', {key:'G'}, 'G')

// ]
// const newArray = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'),
//     h('div', {key:'D'}, 'D'),
//     h('div', {key:'C'}, 'C'),
//     h('div', {key:'M'}, 'M'),
//     h('div', {key:'E'}, 'E'),
//     h('div', {key:'F'}, 'F'),
//     h('div', {key:'G'}, 'G')
// ]

// 综合例子
const oldArray = [
  h("p", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
  h("p", { key: "C" }, "C"),
  h("p", { key: "D" }, "D"),
  h("p", { key: "E" }, "E"),
  h("p", { key: "Z" }, "Z"),
  h("p", { key: "F" }, "F"),
  h("p", { key: "G" }, "G"),
];

const newArray = [
  h("p", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
  h("p", { key: "D" }, "D"),
  h("p", { key: "C" }, "C"),
  h("p", { key: "Y" }, "Y"),
  h("p", { key: "E" }, "E"),
  h("p", { key: "F" }, "F"),
  h("p", { key: "G" }, "G"),
];

export const arrayToArray =
 {
    name: 'arraytotext',
    render() {
        return h('div', {}, this.isChange === true ? newArray : oldArray)
    },

    setup() {
        const isChange = ref(false)
        window.isChange = isChange
        return {
            isChange
        }
    },
}