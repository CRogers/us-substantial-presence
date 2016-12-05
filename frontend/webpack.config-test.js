var nodeExternals = require('webpack-node-externals');

module.exports =  {
    target: 'node',
    externals: [nodeExternals()],
    module: {
        loaders: [
            {
              test: /\.tsx?$/,
              loader: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: ["", ".js", ".ts", ".tsx"],
        moduleDirectories: ['src', 'test', 'node_modules']
    }
};
