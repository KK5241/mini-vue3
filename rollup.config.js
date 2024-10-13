import typescript from '@rollup/plugin-typescript'
export default {
    input: './index.ts',
    output: [{
            file: './lib/mini-vue.esm.js',
            format: 'es'
        },
        {
            file: './lib/mini-vue.cjs.js',
            format: 'cjs'
        }
    ],
    plugins:[
        typescript()
    ]
}