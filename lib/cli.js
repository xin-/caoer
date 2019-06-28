#!/usr/bin/env node

/**
 * @file 程序入口 源码
 */
"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _package = _interopRequireDefault(require("../package.json"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _index = _interopRequireDefault(require("./actions/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CWD = process.cwd();

_commander.default.version(_package.default.version, '-v, --version').alias("cao").description("a webpack-cli").option('-p, --port', 'custom server port').arguments('[mode] [name]').action(function (mode, name) {
  _index.default[mode](name || _commander.default.port);
});

_commander.default.command('xhl').alias("xhldo").description("do something").arguments('[mode] [name]').action(function (mode, name) {
  console.log(mode, name);
  console.log(_index.default);
});

_commander.default.parse(process.argv);