const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

require('dotenv-defaults').config();

const paths = require('./paths');

let publicUrl = process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : '/';

if (!publicUrl) {
  publicUrl = '/';
} else if (!publicUrl.endsWith('/')) {
  publicUrl = publicUrl + '/';
}

const pages = [
  "index"
];

module.exports = {
  entry: pages.reduce((config, page) => {
    config[page] = `./src/${page}.js`;
    return config;
  }, {}),
  output: {
    path: paths.dist,
    filename: 'js/[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // Image assets
      {
        test: /\.(gif|ico|jpe?g|png|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      // Fonts
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          context: paths.public,
        },
      ],
    }),
    new ESLintPlugin({
      extensions: 'js',
      context: paths.src,
    }),
    new StylelintPlugin({
      extensions: ['css', 'scss'],
      context: paths.src,
    }),
    new Dotenv(),
  ].concat(
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `./src/${page}.html`,
          filename: `${page}.html`,
          chunks: [page],
        })
    ),
  ),
};
