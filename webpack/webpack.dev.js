var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        // activate HMR for React
        'react-hot-loader/patch',

        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        'webpack-dev-server/client?http://127.0.0.1:3000',

        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
        'webpack/hot/only-dev-server',

        // the entry point of our app
        './src/index.js',
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
        path: path.resolve(__dirname, 'public/dist'),

        // necessary for HMR to know where to load the hot update chunks
        publicPath: '/static/'
    },

    devtool: 'inline-source-map',

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
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
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
                    'sass-loader?outputStyle=expanded&imagePath=/public/assets/images&includePaths[]=' + path.resolve('resources/sass')
                ]
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),

        // enable HMR globally
        new webpack.HotModuleReplacementPlugin(),

        // prints more readable module names in the browser console on HMR updates
        new webpack.NamedModulesPlugin(),

        // do not emit compiled assets that include errors
        new webpack.NoEmitOnErrorsPlugin()
    ],

    devServer: {
        host: '127.0.0.1',
        port: 3000,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        contentBase: './public',

        // respond to 404s with index.html
        historyApiFallback: true,

        // enable HMR on the server
        hot: true
    }

};
