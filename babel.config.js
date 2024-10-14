// 配置jest的时候配置的
module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 'current'
            }
        }],
        '@babel/preset-typescript',
    ],

};