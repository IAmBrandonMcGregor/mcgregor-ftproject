const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: '[name].css',
    allChunks: true,
    disable: process.env.NODE_ENV === "development",
});

module.exports = {
  entry: {
    app: './src/app.js',
  },
  resolve: {
    alias: {
        null: path.resolve(__dirname, 'src', 'null.js'),
        //jquery: 'jquery/dist/jquery.slim.min.js',
        underscore: 'null',
        backbone: 'exoskeleton/exoskeleton.js',
    },
  },
  devServer: {
    contentBase: './'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  devtool: "source-map",
  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: [/node_modules/],
              use: [{
                  loader: 'babel-loader',
                  options: {
                      presets: ['es2015'],
                  },
              }],
          },
          {
              test: /\.html$/,
              use: [{
                  loader: 'ractive-loader',
              }],
          },
          {
              test: /\.sass$/,
              use: extractSass.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }],
                // use style-loader in development
                fallback: "style-loader"
            })
          },
          { test: /\.txt$/, use: 'raw-loader' }
      ]
  },
  plugins: [
      extractSass
  ]
};