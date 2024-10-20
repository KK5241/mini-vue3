import { h } from "../../lib/mini-vue.esm.js"
export const App = {
    setup(){
        const x = 500
        const y = 500
        return {
            x,
            y
        }
    },
    render() {
        return h('rect',{x:this.x,y:this.y})
    },
}