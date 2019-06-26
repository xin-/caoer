"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _webpack = _interopRequireDefault(require("webpack"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _httpProxyMiddleware = _interopRequireDefault(require("http-proxy-middleware"));

var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));

var _dev = _interopRequireDefault(require("../webpack/dev"));

var _chalk = _interopRequireDefault(require("chalk"));

var _mockjs = _interopRequireDefault(require("mockjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var CWD = process.cwd();

function start(caoerConfig) {
  var app = (0, _express["default"])();
  var config = (0, _dev["default"])(caoerConfig);
  var compiler = (0, _webpack["default"])(config);
  var is_start = process.env.MODE == 'start';
  var https = Promise.resolve().then(function () {
    return _interopRequireWildcard(require("".concat(https)));
  });
  var httpsServer = https.createServer(credentials, app);
  var cerdentials = {
    key: _fs["default"].readFileSync(_path["default"].resolve(__dirname, './private.pem'), 'utf8'),
    cert: _fs["default"].readFileSync(_path["default"].resolve(__dirname, './file.crt'), 'utf8')
  };
  httpsServer.listen(443, function () {
    cnosole.log(_chalk["default"].green('https-server is running on 443'));
  });
  is_start && app.use(Promise.resolve().then(function () {
    return _interopRequireWildcard(require('webpack-dev-middleware'));
  })(compiler, {
    noInfo: false,
    publicPath: '/',
    stats: {
      colors: true,
      cached: false,
      exclude: [/node_modules[\\\/]/]
    }
  }));
  is_start && app.use(Promise.resolve().then(function () {
    return _interopRequireWildcard(require('webpack-hot-middleware'));
  })(compiler)); // Mock Server

  var mockConfigPath = _path["default"].resolve(CWD, 'mock.js');

  if (_fs["default"].existsSync(mockConfigPath)) {
    var data = Promise.resolve().then(function () {
      return _interopRequireWildcard(require("".concat(mockConfigPath)));
    });

    if (!Array.isArray(data)) {
      console.error('mock config data must be an array\n');
    } else {
      data.map(function (item) {
        if (item.proxy) {
          (0, _httpProxyMiddleware["default"])(item.path, {
            target: item.proxy,
            changeOrigin: !!item.changeOrigin,
            ws: !!item.wa,
            pathRewrite: item.pathRewrite,
            headers: item.headers
          });
        } else if (item.controller) {
          app[item.method || 'get'](item.path, item.controller);
        } else {
          app[item.method || 'get'](item.path, function (req, res) {
            var data = _mockjs["default"].mock(item.data);

            res.send(data);
          });
        }
      });
    }
  } // 静态资源


  app.use(_express["default"]["static"](_path["default"].resolve(CWD, caoerConfig.build))); // html
  // if()

  app.listen(caoerConfig.port, caoerConfig.host, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('🌎  Listening at http://' + caoerConfig.host + ':' + caoerConfig.port, browserToOpenWith ? ' browser:' + browserToOpenWith : '');
  });
}

var _default = {
  start: start
};
exports["default"] = _default;