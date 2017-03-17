const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        app: ['./src/client/client.ts'],
        vendor: ['jquery','socket.io-client', 'bootstrap']
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js', '.webpack.js', '.scss']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader',
                query: {
                    configFileName: './tsconfig.json'
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
        new webpack.ProvidePlugin({jQuery: 'jquery'})  
    ]
};