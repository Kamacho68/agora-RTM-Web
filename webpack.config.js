const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'development', // production
    entry: {
        main: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        assetModuleFilename: '[name][ext]',
        clean: true,
    },
    devtool: 'inline-source-map', // keeps where all the content came from, all modules css, js etc... lets the browser know where these come from
    devServer: {
        // contentBase: path.resolve(__dirname, 'dist'), // deprecated
        // static: {
        //     directory: path.join(__dirname, 'dist'),
        // },
        static: path.resolve(__dirname, 'dist'),
        port: process.env.PORT || 5003, // default 8080
        open: true, // launches the default browser, 
        hot: true, // hot reload, if anything in the src changes reload in memory
        // watchContentBase: true, // if anything in the src changes reload in memory // deprecated
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.(svg|ico|png|webp|jpg|gif|jpeg)$/, type: 'asset/resource' },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader"
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            title: 'Real Time Messaging',
            filename: "index.html",
            template: path.resolve(__dirname, 'src/index.html')
        })
    ]
};