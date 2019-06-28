"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _config = _interopRequireDefault(require("../utils/config"));

var _server = _interopRequireDefault(require("../utils/server"));

var _ora = _interopRequireDefault(require("ora"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file tasks cli支持的任务列表页
 */
var CWD = process.cwd();
var load = (0, _ora.default)({
  text: _chalk.default.blue('Loading template...\n')
});
var tasks = {
  init: function init(name) {
    if (!name || !name.length) {
      console.log(_chalk.default.red('ERROR:: App name is required'));
      process.exit(1);
    }

    load.start();

    _shelljs.default.cp('-R', _path.default.resolve(__dirname, "../templates/".concat(name, "/app")), _path.default.resolve(CWD, name));

    load.stop();
    console.log(_chalk.default.green("\u9879\u76EE ".concat(name, " \u521B\u5EFA\u6210\u529F")));
  },
  start: function start(port) {
    load.start();

    var check_modules = function check_modules() {
      if (!_fs.default.existsSync(_path.default.resolve(CWD, 'node_modules'))) {
        console.log(_chalk.default.green('installing npm packages ... \n'));

        _shelljs.default.exec('npm install');
      }
    };

    check_modules();
    process.env.MODE = 'start';
    port && (_config.default.port = port);

    _server.default.start(_config.default);

    load.stop();
  }
};
var _default = tasks;
exports.default = _default;