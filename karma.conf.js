// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-phantomjs-launcher'),
      require('karma-webpack'),
    ],
    files: [
      { pattern: './test/test_*.js', watched: false }
    ],
    preprocessors: {
      './test/*.js': ['webpack']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true,
    webpack: {

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
      watch: false
    },
    webpackServer: {
      noInfo: true
    }
  });
};
