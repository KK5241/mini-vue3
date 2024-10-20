import {
    App
} from './App.js'
import {
    createRenderer
} from '../../lib/mini-vue.esm.js';
const game = new PIXI.Application()
await game.init({
    width: 500,
    height: 500
})
document.body.append(game.canvas);

const render = createRenderer({
    createElement(type) {
        if (type === 'rect') {
            const rect = new PIXI.Graphics();
            rect.beginFill(0xff0000);
            rect.drawRect(0, 0, 100, 100);
            rect.endFill();
            return rect;
        }
    },
    patchProps(el, key, value) {
        el[key] = value;
    },
    insert(el, parent) {
        parent.addChild(el)
    }
})

render.createApp(App).mount(game.state)