import { createApp } from "../../lib/mini-vue.esm.js";
import {App} from './App.js'
const rootComponent = document.querySelector('#app')

createApp(App).mount(rootComponent)