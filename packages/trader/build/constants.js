const CircularDependencyPlugin = require('circular-dependency-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
// const HtmlWebPackPlugin = require('html-webpack-plugin');
// const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const IgnorePlugin = require('webpack').IgnorePlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const {
    // copyConfig,
    cssConfig,
    // htmlInjectConfig,
    // htmlOutputConfig,
    stylelintConfig,
} = require('./config');
const {
    css_loaders,
    file_loaders,
    html_loaders,
    js_loaders,
    svg_file_loaders,
    svg_loaders,
    IS_RELEASE,
} = require('./loaders-config');

const ALIASES = {
    _common: path.resolve(__dirname, '../src/_common'),
    App: path.resolve(__dirname, '../src/App'),
    AppV2: path.resolve(__dirname, '../src/AppV2'),
    Assets: path.resolve(__dirname, '../src/Assets'),
    Constants: path.resolve(__dirname, '../src/Constants'),
    Fonts: path.resolve(__dirname, '../src/public/fonts'),
    Images: path.resolve(__dirname, '../src/public/images'),
    Modules: path.resolve(__dirname, '../src/Modules'),
    Sass: path.resolve(__dirname, '../src/sass'),
    Services: path.resolve(__dirname, '../src/Services'),
    Stores: path.resolve(__dirname, '../src/Stores'),
    Translations: path.resolve(__dirname, '../src/public/translations'),
    Types: path.resolve(__dirname, '../src/Types'),
    Utils: path.resolve(__dirname, '../src/Utils'),
};

const rules = (is_test_env = false) => [
    ...(is_test_env
        ? [
              {
                  test: /\.(js|jsx)$/,
                  exclude: /node_modules|__tests__|(build\/.*\.js$)|(_common\/lib)/,
                  include: /src/,
                  loader: 'eslint-loader',
                  enforce: 'pre',
                  options: {
                      formatter: require('eslint-formatter-pretty'),
                      configFile: path.resolve(__dirname, '../.eslintrc.js'),
                      ignorePath: path.resolve(__dirname, '../.eslintignore'),
                  },
              },
              {
                  test: /\.(ts|tsx)$/,
                  exclude: /node_modules|__tests__|(build\/.*\.js$)|(_common\/lib)/,
                  include: /src/,
                  loader: 'eslint-loader',
                  enforce: 'pre',
                  options: {
                      formatter: require('eslint-formatter-pretty'),
                      configFile: path.resolve(__dirname, '../.eslintrc.ts'),
                      ignorePath: path.resolve(__dirname, '../.eslintignore'),
                  },
              },
          ]
        : []),
    {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: is_test_env ? /node_modules/ : /node_modules|__tests__/,
        include: is_test_env ? /__tests__|src/ : /src/,
        use: js_loaders,
    },
    {
        test: /\.html$/,
        exclude: /node_modules/,
        use: html_loaders,
    },
    {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        exclude: /node_modules/,
        use: file_loaders,
    },
    {
        test: /\.svg$/,
        exclude: /node_modules/,
        include: /public\//,
        use: svg_file_loaders,
    },
    {
        test: /\.svg$/,
        exclude: /node_modules|public\//,
        use: svg_loaders,
    },
    is_test_env
        ? {
              test: /\.(sc|sa|c)ss$/,
              loaders: 'null-loader',
          }
        : {
              test: /\.(sc|sa|c)ss$/,
              use: css_loaders,
          },
];

const MINIMIZERS = !IS_RELEASE
    ? []
    : [
          new TerserPlugin({
              test: /\.js$/,
              exclude: /(smartcharts)/,
              parallel: 2,
          }),
          new CssMinimizerPlugin(),
      ];

const plugins = (base, is_test_env) => [
    new CleanWebpackPlugin(),
    // new HtmlWebPackPlugin(htmlOutputConfig()),
    // new HtmlWebpackTagsPlugin(htmlInjectConfig()),
    new IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
    new MiniCssExtractPlugin(cssConfig()),
    new CircularDependencyPlugin({ exclude: /node_modules/, failOnError: true }),
    new ForkTsCheckerWebpackPlugin(),
    ...(IS_RELEASE
        ? []
        : [
              new WebpackManifestPlugin({
                  fileName: 'trader/asset-manifest.json',
                  filter: file => file.name !== 'CNAME',
              }),
          ]),
    ...(is_test_env
        ? [new StylelintPlugin(stylelintConfig())]
        : [
              // ...(!IS_RELEASE ? [ new BundleAnalyzerPlugin({ analyzerMode: 'static' }) ] : []),
          ]),
];

module.exports = {
    IS_RELEASE,
    ALIASES,
    plugins,
    rules,
    MINIMIZERS,
};
