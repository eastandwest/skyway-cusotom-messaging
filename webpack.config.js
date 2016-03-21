var webpack = require('webpack')
  , path = require('path')
  , _entry = {}
  , _devtool = ""
  , _output = {}
  , _port = 8080

// change configuration by NODE_ENV
switch(process.env.NODE_ENV) {
  case "production":
    _entry = {
           "peer_custom_mesg" : "./lib/main.js",
    };
    _devtool = 'source-map';
    _output = {
      path: path.join(__dirname, "dist"),
      publicPath: "dist",
      filename: "[name].min.js"
    };
    _port = 8080;
    break;
  case "devtest":
    _entry = {
           "unittest" : "./test/unittest_entry.js"
    };
    _output = {
      path: path.join(__dirname, "test"),
      publicPath: "test",
      filename: "[name].build.js"
    };
    _port = 8081;
    break;
  case "sample":
    _entry = {
           "sample-monitor" : "./sample/components/monitor-entry.js",
           "sample-camera" : "./sample/components/camera-entry.js"
    };
    _devtool = 'source-map';
    _output = {
      path: path.join(__dirname, "sample/dist"),
      publicPath: "dist",
      filename: "[name].build.js"
    };
    _port = 8080;
    break;
  case "development":
  default:
    _entry = {
           "peer_custom_mesg" : "./lib/main.js",
    };
    _devtool = 'source-map';
    _output = {
      path: path.join(__dirname, "dist"),
      publicPath: "dist",
      filename: "[name].js"
    };
    _port = 8080;
    break;
}

module.exports = {
  entry: _entry,
  devtool: _devtool,
  output: _output,
  module: {
            loaders: [
            {
              test: /\.(js|jsx)?$/,
              exclude: /(node_modules)/,
              loader: 'babel', // 'babel-loader' is also a legal name to reference
              query: {
                presets: ['react', 'es2015']
              }
            },
            {
              test: /\.html$/,
              loader: 'raw-loader'
            }
            ]
          },
 devServer:{
   port: _port
 }
}
