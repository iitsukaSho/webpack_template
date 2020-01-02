const path = require('path');

const globule = require('globule');

// html output
const HtmlWebpackPlugin = require('html-webpack-plugin');

// css output
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// post-css plugin
const postcssNormalize = require('postcss-normalize');
const cssMqpacker = require('css-mqpacker');
const cssnano = require('cssnano');

// other files output (copy)
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 不要ファイル削除
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// pugを src内のディレクトリ構成の通り出力
// ====================================================================================

// ディレクトリの設定
const opts = {
  srcDir: path.join(__dirname, 'src/pug'),
  destDir: path.join(__dirname, 'public')
};

const from = 'pug';
const to = 'html';
const htmlPluginConfig = globule.find([`**/*.${from}`, `!**/_*.${from}`], {cwd: opts.srcDir}).map(filename => {
  // const file = filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`).split('/');
  return new HtmlWebpackPlugin({
    filename: filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`).replace(/(\.\/)?pug/, '.'),
    template: `${opts.srcDir}/${filename}`,
    file: require(`./src/data/meta.json`)
  });
});
// ====================================================================================

module.exports = ( env, argv ) => {
  // mode: 'development',
  const IS_DEVELOPMENT = argv.mode === 'development';

  return {
    entry: {
      app: [
        './src/js/app.js',
        './src/stylus/app.styl'
      ]
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'js/[name]-[hash].js'
    },
    watch: true,
    // import を js ファイル以外でも使えるようにする
    resolve: {
      modules: ['node_modules'],
      // import できる拡張子を指定
      extensions: ['.json', '.js', '.styl'],
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@public': path.resolve(__dirname, 'public'),
      }
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: [
            {
              loader: 'pug-loader',
              options: {
                pretty: IS_DEVELOPMENT,
                self: true,
                root: path.resolve(__dirname, 'src/pug')
              }
            }
          ]
        },
        {
          test: /\.styl$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                url: true,
                sourceMap: IS_DEVELOPMENT,
                // stylus と PostCSS の2つ
                importLoaders: 2
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  cssnano({
                    preset: 'default'
                  }),
                  cssMqpacker({
                    sort: true
                  }),
                  require('postcss-flexbugs-fixes'),
                  require('postcss-preset-env')({
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }),
                  postcssNormalize({
                    browsers: [">0.25% in JP", "not ie <= 10", "not op_mini all"],
                  }),
                ].filter(Boolean),
                sourceMap: IS_DEVELOPMENT,
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                sourceMap: false,
              }
            }
          ],
          sideEffects: true,
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', { modules: false }]]
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            outputPath: (path) => path.replace('src/',''),
            publicPath: IS_DEVELOPMENT ? (path,name) => path.replace(path,name.replace('src/','public/')) : (path) => path.replace('src/','/'),
          }
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader'
        }
      ]
    },
    devtool: IS_DEVELOPMENT ? 'source-map' : 'none',
    plugins: [
      ...htmlPluginConfig,
      new CleanWebpackPlugin(
        {
          dry: false,
          verbose: true,
          cleanOnceBeforeBuildPatterns: ['**/*'],
          cleanAfterEveryBuildPatterns: ['!img','!img/*','!favicon.ico','!assets/*']
        }
      ),
      new MiniCssExtractPlugin({
        filename: "css/[name]-[hash].css",
      }),
      new CopyWebpackPlugin([
        { from: "src/data/manifest.json", to: "assets/" },
        { from: "src/img/", to: "img/" },
        { from: "src/img/favicon.ico", to: "./" }
      ])
    ],
  };
};