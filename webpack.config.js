var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: "./src/app.js",
  },
  output: {
    path: __dirname +  '/bin',
    publicPath: "./",
    filename: "[name].bundle.js",
    chunkFilename: "[id].bundle.js"
  },
  resolve: {
    alias: {
      jquery: "jquery/src/jquery"
    }
  },
  htmlLoader: {
    ignoreCustomFragments: [/\{\{.*?}}/],
    // root: "./src",
    attrs: ['img:src', 'link:href']
  },
  module: {
    loaders: [
    {
      test: /[\/\\]node_modules[\/\\]jquery[\/\\]src[\/\\]jquery\.js$/,
      loader: "imports?this=>window"
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("css?root=.!resolve-url")
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract("css?root=.!resolve-url!sass?sourceMap")
    },
    {
      test: /\.html$/,
      loader: "html"
    },
    // {
    //   test: /\.(eot|woff|woff2|ttf|svg|png|jpg|jpeg)$/,
    //   loader: "url-loader?limit=10000&name=[name]-[hash].[ext]"
    // },
    {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|jpeg)$/,
      loader: "file-loader"
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      velocity: "velocity-animate"
    }),
    new ExtractTextPlugin("[name].bundle.css"),
    new HtmlWebpackPlugin({
      title: "SmartEnergy",
      template: "./src/index.ejs",
      inject: 'body',
    })
  ],
};
