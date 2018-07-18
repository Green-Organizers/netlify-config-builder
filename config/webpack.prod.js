const path = require('path');
const glob = require('glob')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ManifestPlugin = require("webpack-manifest-plugin");
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const postCssLoader = {
   loader: 'postcss-loader',
   options: {
      config: {
         path: './config/postcss.config.js'
      }
   }
}

const ManifestPluginConfig = {
   fileName: 'asset-manifest.json'
}

const ImageminPluginConfig = {
   pngquant: {
      quality: '95-100'
   }
}

const cssLoader = {
   loader: 'css-loader',
   query: {
      importLoaders: 1,
      localIdentName: 'purify_[local]_[hash:base64:5]',
      minimize: true,
      modules: true
   }
}

module.exports = merge(common, {
   mode: 'production',
   output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'static/js/bundle.js',
   },
   module: {
      rules: [
         { test: /\.css$/, use: [MiniCssExtractPlugin.loader, cssLoader, postCssLoader] },
         { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, cssLoader, postCssLoader, 'sass-loader'] },
      ],
   },
   plugins: [
      new UglifyJsPlugin(),
      new CleanWebpackPlugin(['dist/**/*'], { root: path.resolve(__dirname, '../') }),
      new ImageminPlugin(ImageminPluginConfig),
      new ManifestPlugin(ManifestPluginConfig),
      new MiniCssExtractPlugin({ filename: 'static/css/[name].css', chunkFilename: '[id].css' }),
      new PurifyCSSPlugin({
         paths: glob.sync(path.join(__dirname, '../src/**/*.js')),
         purifyOptions: { info: true, minify: true, whitelist: ['*purify*'] }
      }),
   ],
});