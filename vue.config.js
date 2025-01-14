const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const publicPath = process.env.NODE_ENV === 'production' ? '/' : '/';
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  publicPath: publicPath,
  outputDir: 'dist',

  // (js/css/img/font/...)
  assetsDir: './static',
  //lintOnSave: process.env.NODE_ENV !== 'production',

  // https://cn.vuejs.org/v2/guide/installation.html#
  // compiler: false,

  transpileDependencies: [
    '@dfinity/agent',
    '@dfinity/auth-client',
    '@dfinity/authentication',
    '@dfinity/candid',
    '@dfinity/identity',
    '@dfinity/principal'
  ],

  productionSourceMap: false,

  //  https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/webpack.md
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
  },
  // CSS
  css: {
    sourceMap: true,

    loaderOptions: {}
  },
  lintOnSave: false,
  parallel: require('os').cpus().length > 1,

  // PWA。
  //  https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md
  pwa: {},

  //  webpack-dev-server 。
  // devServer: {
  //   disableHostCheck: true,
  //   host: '0.0.0.0',
  //   port: 8081,
  //   https: false,
  //   hotOnly: false,
  //   // eslint-disable-next-line no-dupe-keys
  //   open: true,
  // },
  // // eslint-disable-next-line no-dupe-keys
  configureWebpack: {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    target: ['web', 'es5'],
    plugins: [new NodePolyfillPlugin()],
    module: {
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: path.resolve(__dirname, './clearConsole.js')
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: path.resolve(__dirname, './clearConsole.js')
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: path.resolve(__dirname, './clearConsole.js')
        }
      ]
    }
  }
  // pluginOptions: {}
};
