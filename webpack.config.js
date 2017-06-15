'use strict';

let webpack = require('webpack');

let PACKAGE = require('./package.json');

module.exports = {
  entry: ["./lib/index"],
  output: {
    path: __dirname + "/dist",
    filename: 'promote-editor.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: [ /node_modules/ ],
        query: { presets: ["es2015"] }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin("(C) Copyright Promote International AB\nPromote editor version: " + PACKAGE.version),
    new webpack.optimize.DedupePlugin()
  ],
  resolve: {
    modules: ["lib", "node_modules"]
  }
};
