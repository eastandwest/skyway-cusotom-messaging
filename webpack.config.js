var webpack = require('webpack')
  , path = require('path');

module.exports = {
  entry: {
           "peer_custom_mesg" : "./lib/main.js",
         },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "dist",
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
   port:8080
 }
}
