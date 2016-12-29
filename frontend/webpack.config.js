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
            {test: /\.tsx?/, loader: 'ts-loader'},
            {test: /\.css$/, loader: "style!css"},
            {test: /\.less$/, loader: "style!css!less"},
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=public/fonts/[name].[ext]'
            }
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