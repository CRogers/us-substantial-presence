var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.ts',
    output: {
        path: __dirname + '/site',
        publicPath: '',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {test: /\.ts/, loader: 'ts-loader'}
        ]
    },
    resolve: { extensions: ["", ".js", ".ts"] },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'US Substantial Presence',
            filename: 'index.html'
        })
    ]
};