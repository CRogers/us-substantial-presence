module.exports = {
    entry: './src/app.ts',
    output: {
        path: __dirname + '/site/scripts',
        publicPath: '/scripts/',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {test: /\.ts/, loader: 'ts-loader'}
        ]
    },
    resolve: { extensions: ["", ".js", ".ts"] },
};