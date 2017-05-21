const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, '/'),
        compress: true,
        port: 9000,
        hot: true
    },
    devtool: "source-map"
};

