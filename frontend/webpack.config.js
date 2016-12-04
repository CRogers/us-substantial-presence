var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.tsx',
    output: {
        path: __dirname + '/site',
        publicPath: '',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {test: /\.tsx?/, loader: 'ts-loader'}
        ]
    },
    resolve: {
        extensions: ["", ".js", ".ts", ".tsx"],
        moduleDirectories: ['src']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'US Substantial Presence',
            filename: 'index.html'
        })
    ]
};