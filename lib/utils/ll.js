/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// This Webpack plugin ensures `npm install <library>` forces a project rebuild.
// We’re not sure why this isn't Webpack's default behavior.
// See https://github.com/facebook/create-react-app/issues/186.
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WatchMissingNodeModulesPlugin =
/*#__PURE__*/
function () {
  function WatchMissingNodeModulesPlugin(nodeModulesPath) {
    _classCallCheck(this, WatchMissingNodeModulesPlugin);

    this.nodeModulesPath = nodeModulesPath;
  }

  _createClass(WatchMissingNodeModulesPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      compiler.hooks.emit.tap('WatchMissingNodeModulesPlugin', function (compilation) {
        var missingDeps = Array.from(compilation.missingDependencies);
        var nodeModulesPath = _this.nodeModulesPath; // If any missing files are expected to appear in node_modules...

        if (missingDeps.some(function (file) {
          return file.includes(nodeModulesPath);
        })) {
          // ...tell webpack to watch node_modules recursively until they appear.
          compilation.contextDependencies.add(nodeModulesPath);
        }
      });
    }
  }]);

  return WatchMissingNodeModulesPlugin;
}();

module.exports = WatchMissingNodeModulesPlugin;