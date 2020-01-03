process.env.NODE_ENV = 'development'
var path = require('path')
var webpack = require("webpack")
var merge = require("webpack-merge")
var baseWebpackConfig = require("./webpack.base.config")
var utils = require("./utils")
var config = require("./config")
var proxy = require('./proxy')
var FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")
var CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve (relPath) {
  return path.resolve(__dirname, relPath)
}

module.exports = merge(baseWebpackConfig, {
  entry: {
    index: resolve('../src/main.js')
  },
  devServer: {
    hot: true,
    port: config.dev.port,
    open: false, // 自动打开浏览器
    proxy: proxy
  },
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: config.dev.outputPath,
    publicPath: config.dev.outputPublicPath
  },
  module: {
    rules: utils.styleLoaders()
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new CopyWebpackPlugin([{
      from: path.resolve('./public'),
      // ignore: ['.*']
    }]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    ...utils.genHtmlPlugins(),
    new FriendlyErrorsPlugin()
  ]
})
