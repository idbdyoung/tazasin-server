const path = require('path');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: process.env.NODE_ENV == 'production' ? 'production' : 'development',
  entry: './src/index.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist/src'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: [
          '/node_modules/',
          this.mode == 'production' ? '/application.dev.json' : '/application.prod.json',
        ],
      },
    ],
  },
  node: {
    __dirname: false,
  },
  plugins: [new Dotenv()],
  externals: [nodeExternals()],
  devtool: 'source-map',
};
