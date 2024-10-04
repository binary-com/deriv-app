const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { IgnorePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const { cssConfig } = require('./config');
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
    'react/jsx-runtime': 'react/jsx-runtime.js',
    Assets: path.resolve(__dirname, '../src/Assets'),
    Components: path.resolve(__dirname, '../src/Components'),
    Configs: path.resolve(__dirname, '../src/Configs'),
    Constants: path.resolve(__dirname, '../src/Constants'),
    Containers: path.resolve(__dirname, '../src/Containers'),
    Helpers: path.resolve(__dirname, '../src/Helpers'),
    Modules: path.resolve(__dirname, '../src/Modules'),
    Sections: path.resolve(__dirname, '../src/Sections'),
    Services: path.resolve(__dirname, '../src/Services'),
    Stores: path.resolve(__dirname, '../src/Stores'),
    Styles: path.resolve(__dirname, '../src/Styles'),
    Types: path.resolve(__dirname, '../src/Types'),
    'react/jsx-runtime': 'react/jsx-runtime.js',
};

const rules = (is_test_env = false) => [
    ...(is_test_env
        ? [
              {
                  test: /\.(js|jsx|ts|tsx)$/,
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
              parallel: 2,
          }),
          new CssMinimizerPlugin(),
      ];

const plugins = () => [
    new CleanWebpackPlugin(),
    new IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
    new MiniCssExtractPlugin(cssConfig()),
];

module.exports = {
    IS_RELEASE,
    ALIASES,
    plugins,
    rules,
    MINIMIZERS,
};
