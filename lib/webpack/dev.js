"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _webpack = _interopRequireDefault(require("webpack"));

var _transferWebpackPlugin = _interopRequireDefault(require("transfer-webpack-plugin"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _autoprefixer = _interopRequireDefault(require("autoprefixer"));

var _precss = _interopRequireDefault(require("precss"));

var _WatchMissingNodeModulesPlugin = _interopRequireDefault(require("../utils/WatchMissingNodeModulesPlugin"));

var _caseSensitivePathsWebpackPlugin = _interopRequireDefault(require("case-sensitive-paths-webpack-plugin"));

var _blueimpTmpl = _interopRequireDefault(require("blueimp-tmpl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var CWD = process.cwd();

function _default(config) {
  var __configuration = {
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
    entry: function () {
      if (_typeof(config.pages) == 'object') {
        var entries = {
          'vendor': config.vendor || ['vue', 'vuex'] // common libs bundle

        };

        for (var entry in config.pages) {
          entries[entry] = [require.resolve('webpack-hot-middleware/client'), config.pages[entry].entry];
        }

        return entries;
      }

      return {
        'shared': [require.resolve('webpack-hot-middleware/client'), _path.default.resolve(CWD, config.base, config.pages)],
        'vendor': config.vendor || ['vue', 'vuex'] // common libs bundle

      };
    }(),

    /**
     * Output
     * doc: http://webpack.github.io/docs/configuration.html#output
     */
    output: {
      path: _path.default.resolve(CWD, config.build),
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
        test: /\.(js|jsx)?$/,
        // .jsx or .js files
        use: 'babel-loader',
        exclude: [_path.default.resolve(CWD, 'node_modules')] // query: require('./babel.dev'),

      }, {
        test: /\.css$/,
        include: [_path.default.resolve(CWD, config.base, config.scss)],
        // extract style import from scss to separate css files
        // use: 'style!css!postcss!resolve-url'
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader'
        }, {
          loader: 'resolve-url-loader'
        }]
      }, {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [(0, _autoprefixer.default)({
              // see https://browserl.ist/
              // config in package.json/browserslist
              remove: true
            }), _precss.default]
          }
        }, {
          loader: 'resolve-url-loader'
        }, {
          loader: 'less-loader'
        }]
      }, {
        test: /\.svg/,
        use: 'svg-url-loader'
      }, {
        test: /\.(png|jpg|gif|jpeg)$/,
        // < 20k, otherwise file-loader is used auto
        use: [{
          loader: 'url-loader',
          options: {
            limit: config.base64_image_limit
          }
        }]
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
      alias: config.alias // modulesDirectories: ["web_modules", "node_modules", 'bower_components'],
      // extensions: ['.js', '.json', '.jsx', '.scss', '.css', '.less'],
      // fallback: [path.resolve(__dirname, '..', '..', 'node_modules')]

    },
    optimization: {// splitChunks: {
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
    plugins: [//Enables Hot Modules Replacement
    new _webpack.default.HotModuleReplacementPlugin(), //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new _webpack.default.NoEmitOnErrorsPlugin(), // Define Global variable
    new _webpack.default.DefinePlugin(function () {
      var global_defines = {
        'process.env': {
          MODE: JSON.stringify(process.env.MODE),
          NODE_ENV: JSON.stringify('development')
        },
        'API': JSON.stringify(config.api[process.env.MODE]),
        'STATIC': JSON.stringify(config.static[process.env.MODE])
      };

      for (var global in config.globals) {
        global_defines[global.toUpperCase()] = JSON.stringify(config.globals[global][process.env.MODE]);
      }

      return global_defines;
    }()), // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new _caseSensitivePathsWebpackPlugin.default(), // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new _WatchMissingNodeModulesPlugin.default(_path.default.resolve(CWD, 'node_modules')), // style extract as specified
    // new ExtractTextPlugin('css/[name]-[contenthash:8].css'),
    // Global modules
    // http://webpack.github.io/docs/shimming-modules.html
    new _webpack.default.ProvidePlugin({
      Vue: 'vue' // Vuex: 'vuex',
      // VueRouter: 'vue-router'

    }), new _transferWebpackPlugin.default(config.transfer_assets ? [{
      from: _path.default.join(config.base, config.assets || 'assets'),
      to: _path.default.join(config.assets || 'assets')
    }] : [], _path.default.resolve(CWD))]
  };
  var global_defines = {
    'API': config.api[process.env.MODE],
    'STATIC': config.static[process.env.MODE],
    'MODE': process.env.MODE
  };

  for (var global in config.globals) {
    global_defines[global.toUpperCase()] = config.globals[global][process.env.MODE];
  } // Generate HTML


  if (_typeof(config.pages) == 'object') {
    var _loop = function _loop(key) {
      var entry = config.pages[key];
      !function () {
        var _template = _fs.default.readFileSync(entry.path, 'utf8');

        var mockData = entry.mock && Promise.resolve().then(function () {
          return _interopRequireWildcard(require("".concat(entry.mock)));
        });
        var favicon = entry.favicon,
            title = entry.title,
            keywords = entry.keywords,
            description = entry.description,
            viewport = entry.viewport;

        __configuration.plugins.push(new _htmlWebpackPlugin.default({
          chunks: [key, 'vendor'],
          filename: "".concat(key, ".html"),
          favicon: favicon,
          title: title,
          keywords: keywords,
          description: description,
          viewport: viewport,
          inject: false,
          templateContent: function templateContent(templateParams, compolation) {
            if (mockData) {
              mockData.forEach(function (reg) {
                _template = (_readOnlyError("_template"), _template.replace(reg[0], reg[1]));
              });
            } // console.log('================')


            templateParams.configs = global_defines;
            return (0, _blueimpTmpl.default)(_template, templateParams);
          }
        }));
      }();
    };

    for (var key in config.pages) {
      _loop(key);
    }
  }

  return __configuration;
}