import { h } from "../../lib/mini-vue.esm.js";
export const Foo = {
    render(){
       return h('div',{},'foo:' + this.count)
    },
    // setup 是在初始化的时候被调用的
    setup(props, {emit}){
        console.log(props);
        props.count ++
        emit('add',1,2)
        emit('sum',2,5)
        emit('sum-add',1,3)
    }
}