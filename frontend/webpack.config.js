var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.tsx',
    output: {
        path: __dirname + '/site',
        publicPath: '',
        filename: 'app.js'
    },
    target: 'web',
    module: {
        loaders: [
            {test: /\.tsx?/, loader: 'ts-loader'}
        ]
    },
    resolve: {
        extensions: ["", ".js", ".ts", ".tsx"],
        moduleDirectories: ['src', 'node_modules']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'US Substantial Presence',
            filename: 'index.html'
        })
    ]
};