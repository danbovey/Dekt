var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: [
        // the entry point of our app
        './src/index.js'
    ],

    resolve: {
        modules: [
            'node_modules',
            'src',
            'resources/sass'
        ],
        extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.scss', '.css', '.json']
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve('public/build')
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
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    'url-loader?limit=10000&mimetype=application/font-woff'
                ]
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    'file-loader'
                ]
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

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMaps: false
        }),

        new ExtractTextPlugin('style.css')
    ]

};
