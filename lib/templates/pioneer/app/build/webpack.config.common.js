const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    }, {
      test: /\.(png|svg|jpg|gif|jpeg)$/,
      use: ['file-loader']
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader']
    }]
  },
  plugins: [new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.html'
  })]
};