const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new webpack.DefinePlugin({
    '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
  })
];
