/**
 * Created by huangsihuan on 2016/11/13.
 */
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    entry: {
      //  'polyfills': './src/polyfills.ts',
      //  'vendor': './src/vendor.ts',
        'app': './src/boot/boot.js',
        'ks-css': './app/bundle/ks-component.css',
    },

    resolve: {
        extensions: ['', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader', // 'babel-loader' is also a valid name to reference
                query: {
                    presets: ['es2015' ,'stage-0'],  //stage-0   es2015
                 /*   plugins: ['transform-runtime'],*/
                 /*   cacheDirectory: true,*/
                }
             },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw'
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app']
        }),

        new HtmlWebpackPlugin({
            template: './index-prod.html'
        })
    ]
};
