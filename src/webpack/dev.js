import webpack from 'webpack'
import TransferWebpackPlugin from 'transfer-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import fs from 'fs'
import autoprefixer from 'autoprefixer'
import precss from 'precss'
import WatchMissingNodeModulesPlugin from '../utils/WatchMissingNodeModulesPlugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import blueimpTmpl from 'blueimp-tmpl'

const CWD = process.cwd()

export default function (config) {
    const __configuration = {
        mode: 'development',

        /**
         * Devtool
         * doc: http://webpack.github.io/docs/configuration.html#devtool
         */
        devtool: config.tool,

        /**
         * Entry points to the project
         * doc: http://webpack.github.io/docs/configuration.html#entry
         *
         * If you pass an object: Multiple entry bundles are created.
         * The key is the chunk name. The value can be a string or an array.
         */
        entry: (function(){
            if(typeof config.pages == 'object') {
                const entries = {
                    'vendor': config.vendor || ['vue', 'vuex'] // common libs bundle
                };

                for(let entry in config.pages) {
                    entries[entry] = [require.resolve('webpack-hot-middleware/client'), config.pages[entry].entry]
                }

                return entries;
            }

            return {
                'shared': [require.resolve('webpack-hot-middleware/client'), path.resolve(CWD, config.base, config.pages)],
                'vendor': config.vendor || ['vue', 'vuex'] // common libs bundle
            }
        })(),

        /**
         * Output
         * doc: http://webpack.github.io/docs/configuration.html#output
         */
        output: {
            path: path.resolve(CWD, config.build),
            publicPath: config.static[process.env.MODE],
            chunkFilename: 'js/[name]-[chunkhash:8].js',
            filename: 'js/[name].js'
        },
        
        /**
         * allows you to specify dependencies for your library that are not resolved by webpack, but become dependencies of the output.
         * This means they are imported from the environment during runtime.
         */
        externals: config.externals || {},

        module: {
            rules: [{
                test: /\.(js|jsx)?$/, // .jsx or .js files
                use: 'babel-loader',
                exclude: [path.resolve(CWD, 'node_modules')],
                // query: require('./babel.dev'),
            }, {
                test: /\.css$/,
                include: [path.resolve(CWD, config.base, config.scss)],// extract style import from scss to separate css files
                // use: 'style!css!postcss!resolve-url'
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {
                        loader: 'postcss-loader',

                    },
                    {loader: 'resolve-url-loader'}
                ]
            }, {
                test: /\.less$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                autoprefixer({
                                    // see https://browserl.ist/
                                    // config in package.json/browserslist
                                    remove: true 
                                }),
                                precss
                            ]
                        }
                    },
                    {loader: 'resolve-url-loader'},
                    {loader: 'less-loader'}
                ]
            }, {
                test: /\.svg/,
                use: 'svg-url-loader'
            }, {
                test: /\.(png|jpg|gif|jpeg)$/,
                // < 20k, otherwise file-loader is used auto
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: config.base64_image_limit
                        }
                    }
                ]
            }, {
                test: /\.(ttf|eot|woff[1-9]?)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader?name=" + config.assets + "/fonts/[name]-[hash:8].[ext]"
            }, {
                test: /\.json$/,
                use: "json-loader"
            }]
        },

        /**
         * Resolve
         * doc: doc: http://webpack.github.io/docs/configuration.html#resolve
         */
        resolve: {
            // root: CWD,
            alias: config.alias,
            // modulesDirectories: ["web_modules", "node_modules", 'bower_components'],
            // extensions: ['.js', '.json', '.jsx', '.scss', '.css', '.less'],
            // fallback: [path.resolve(__dirname, '..', '..', 'node_modules')]
        },

        optimization: {
            // splitChunks: {
                
            // }
        },
        // // Split vendors
        // new webpack.optimize.CommonsChunkPlugin("vendor", "js/vendor.bundle.js"),

        // // common module extract
        // new webpack.optimize.CommonsChunkPlugin({
        //     filename: "js/commons.bundle.js",
        //     minChunks: 3, // shared within at least 3 modules
        //     minSize: 10 * 1000, // 10k
        //     children: true // include all chunks
        // }),
        /**
         * Plugin
         * doc: http://webpack.github.io/docs/using-plugins.html
         * list: http://webpack.github.io/docs/list-of-plugins.html
         */
        plugins: [
            //Enables Hot Modules Replacement
            new webpack.HotModuleReplacementPlugin(),
            
            //Allows error warnings but does not stop compiling. Will remove when eslint is added
            new webpack.NoEmitOnErrorsPlugin(),

            // Define Global variable
            new webpack.DefinePlugin((function(){
                var global_defines =  {
                     'process.env': {
                         MODE: JSON.stringify(process.env.MODE),
                         NODE_ENV: JSON.stringify('development')
                     },
                     'API': JSON.stringify(config.api[process.env.MODE]),
                     'STATIC': JSON.stringify(config.static[process.env.MODE])
                };

                for(var global in config.globals) {
                     global_defines[global.toUpperCase()] = JSON.stringify(config.globals[global][process.env.MODE])
                }

                return global_defines;
            })()),

            // Watcher doesn't work well if you mistype casing in a path so we use
			// a plugin that prints an error when you attempt to do this.
			// See https://github.com/facebookincubator/create-react-app/issues/240
            new CaseSensitivePathsPlugin(),

            // If you require a missing module and then `npm install` it, you still have
			// to restart the development server for Webpack to discover it. This plugin
			// makes the discovery automatic so you don't have to restart.
			// See https://github.com/facebookincubator/create-react-app/issues/186
            new WatchMissingNodeModulesPlugin(path.resolve(CWD, 'node_modules')),

            // style extract as specified
            // new ExtractTextPlugin('css/[name]-[contenthash:8].css'),
            // Global modules
            // http://webpack.github.io/docs/shimming-modules.html
            new webpack.ProvidePlugin({
                Vue: 'vue',
                // Vuex: 'vuex',
                // VueRouter: 'vue-router'
            }),

            new TransferWebpackPlugin(
                config.transfer_assets 
                    ? [{
                        from: path.join(config.base, config.assets || 'assets'),
                        to: path.join(config.assets || 'assets')
                    }]
                    : [],
                path.resolve(CWD)
            )
        ]
    }

    const global_defines = {
        'API': config.api[process.env.MODE],
        'STATIC': config.static[process.env.MODE],
        'MODE': process.env.MODE
    }
    for(let global in config.globals) {
        global_defines[global.toUpperCase()] = config.globals[global][process.env.MODE]
    }

    // Generate HTML
    if(typeof config.pages == 'object') {
        for(let key in config.pages) {
            const entry = config.pages[key]

            !function() {
                const _template = fs.readFileSync(entry.path, 'utf8')
                const mockData = entry.mock && import(entry.mock)
                const {favicon, title, keywords, description, viewport} = entry
                __configuration.plugins.push(
                    new HtmlWebpackPlugin({
                        chunks: [key, 'vendor'],
                        filename: `${key}.html`,
                        favicon,
                        title,
                        keywords,
                        description,
                        viewport,
                        inject: false,
                        templateContent: function(templateParams, compolation) {
                            if(mockData) {
                                mockData.forEach(reg => {
                                    _template = _template.replace(reg[0], reg[1])
                                })
                            }
                            // console.log('================')
                            templateParams.configs = global_defines
                            return blueimpTmpl(_template, templateParams)
                        }
                    })
                )
            }()
        }
    }

    return __configuration
}