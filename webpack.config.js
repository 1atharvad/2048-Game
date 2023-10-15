const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  mode: 'development',
  entry: ['./src/index.ts', './src/index.scss'],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, 'src', 'static'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.min.css',
    }),
  ],
};

if (process.argv[process.argv.indexOf('--mode') + 1] === 'development') {
  const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
  config.plugins.push(new BrowserSyncPlugin({
    proxy: 'http://127.0.0.1:8080/',
    open: false,
    notify: false,
    files: ['src/static/**'],
  }))
}

module.exports = config;