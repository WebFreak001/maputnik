var webpack          = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig    = require("./webpack.config");
var testConfig       = require("../test/config/specs");
var artifacts        = require("../test/artifacts");
var isDocker         = require("is-docker");


var server;
var SCREENSHOT_PATH = artifacts.pathSync("screenshots");

exports.config = {
  specs: [
    './test/functional/index.js'
  ],
  exclude: [
  ],
  maxInstances: 10,
  capabilities: [{
    maxInstances: 5,
    browserName: 'chrome'
  }],
  sync: true,
  logLevel: 'verbose',
  coloredLogs: true,
  bail: 0,
  screenshotPath: SCREENSHOT_PATH,
  host: (isDocker() ? process.env.DOCKER_HOST : "127.0.0.1"),
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    // Because we don't know how long the initial build will take...
    timeout: 4*60*1000
  },
  onPrepare: function (config, capabilities) {
    return new Promise(function(resolve, reject) {
      var compiler = webpack(webpackConfig);
      server = new WebpackDevServer(compiler, {
        stats: {
          colors: true
        }
      });
      server.listen(testConfig.port, "127.0.0.1", function(err) {
        if(err) {
          reject();
        }
        else {
          resolve();
        }
      });
    })
  },
  onComplete: function(exitCode) {
    server.close()
  }
}
