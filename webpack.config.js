const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');   //

module.exports = {
    entry: ['@babel/polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {    //npm install webpack-dev-server --save-dev
        contentBase: './dist',   //specify the folder from which webpack should serve files
    },
    plugins: [  //plugins receives an array
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};