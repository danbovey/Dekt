var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/index.js',
    },

    resolve: {
        modules: [
            'node_modules',
            'src',
            'resources/sass'
        ],
        extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.scss', '.css', '.json']
    },

    output: {
        path: path.resolve('public/build'),
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.woff(2)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff',
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(ttf|eot|svg)$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff',
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader'
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        'sass-loader?outputStyle=expanded&imagePath=/assets/images&includePaths[]=' + path.resolve('resources/sass')
                    ]
                })
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new BabiliPlugin({
            comments: false
        }),

        new ExtractTextPlugin('style.css'),
        new OptimizeCssAssetsPlugin()
    ]

};
