const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const isDev = process.env.NODE_ENV == 'development';
const isProd = !isDev;
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };
  if (isProd) {
    config.minimizer = [new TerserPlugin(), new CssMinimizerPlugin()];
  }
  return config;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: isDev ? 'development' : 'prodaction',
  entry: {
    mine: ['@babel/polyfill', `./index.jsx`],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: filename('.js'),
  },
  devServer: {
    hot: isDev,
    port: 4000,
    historyApiFallback: true,
  },
  devtool: isDev ? 'source-map' : '',
  optimization: optimization(),
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('.css'),
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
  ],
  resolve: {
    extensions: ['.jsx', '.js', '.scss', '.css', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.s[ca]ss$/,
        exclude: /node_modules/,
        use: [
          isDev ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              sourceMap: isDev,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
        include: /.model.s[ac]ss$/,
      },
      {
        test: /\.s[ca]ss$/,
        exclude: [/node_modules/, /.model.s[ac]ss$/],
        use: [
          isDev ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
};
