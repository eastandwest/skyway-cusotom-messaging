var webpack = require('webpack')
  , path = require('path');

module.exports = {
  entry: {
           "unittest" : "./test/unittest_entry.js"
  },
  output: {
    path: path.join(__dirname, "test"),
    publicPath: "test",
    filename: "[name].build.js"
  },
  module: {
            loaders: [
            {
              test: /\.(js|jsx)?$/,
              exclude: /(node_modules)/,
              loader: 'babel', // 'babel-loader' is also a legal name to reference
              query: {
                presets: ['react', 'es2015']
              }
            }
            ]
          },
  devServer:{
    port: 8081
  }
}
