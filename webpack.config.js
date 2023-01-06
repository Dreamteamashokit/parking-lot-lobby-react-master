var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var ModuleConcatenationPlugin = require("webpack").optimize.ModuleConcatenationPlugin;
let isDevelopment = true;
var HTMLWebpackPluginConfig= new HtmlWebpackPlugin({
  template:'./src/index.html',
  filename:'index.html',
  inject:'body'
   });

module.exports = {
    mode: 'development',
    entry:['./src/index.jsx'],
    output:{
      path:__dirname+'/build',
      filename:'index_bundle.js',
      publicPath:'/'
       },
    resolve: {
        extensions: ['.js', '.jsx', '.scss']
    },
    module: {
      rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader'
            },
            {
                test: /\.module\.s(a|c)ss$/,
                loader: [
                  isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                  {
                    loader: 'css-loader',
                    options: {
                      modules: true,
                      sourceMap: isDevelopment
                    }
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      sourceMap: isDevelopment
                    }
                  }
                ]
              },
              {
                test: /\.s(a|c)ss$/,
                exclude: /\.module.(s(a|c)ss)$/,
                loader: [
                  isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                  'css-loader',
                  {
                    loader: 'sass-loader',
                    options: {
                      sourceMap: isDevelopment
                    }
                  }
                ]
              },
              {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
              test: /\.(webp|gif)$/,
              loaders: [
                'file-loader',
                'webp-loader'
              ]
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    plugins: [
      HTMLWebpackPluginConfig,
    new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
     }),
     new ModuleConcatenationPlugin()
],
    devServer: {
      //port: 8000,
        port: 8080,
        historyApiFallback: true
    },
    externals: {
        // global app config object
        config: JSON.stringify({
            //apiUrl: 'https://api.pll.matrixm.io'
            //apiUrl: 'http://localhost:8005'
            apiUrl: 'https://testapi.parkinglotlobby.com'
        })
    }
}