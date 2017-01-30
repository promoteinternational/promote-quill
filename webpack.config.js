let webpack = require('webpack');

let PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
  entry: ["./lib/index"],
  output: {
    path: __dirname + "/dist",
    filename: PROD ? 'promote-editor.min.js' : 'promote-editor.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [
          __dirname + "/lib",
          __dirname + "/node_modules/quill"
        ],
        query: { presets: ["es2015"] }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ] : []
};
