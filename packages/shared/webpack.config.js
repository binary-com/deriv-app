const StyleLintPlugin   = require('stylelint-webpack-plugin');
const path              = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isServe = process.env.BUILD_MODE === 'serve';

module.exports = {
    target: 'web',
    entry : {
        contract   : path.resolve(__dirname, 'src', 'utils/contract/index.js'),
        currency   : path.resolve(__dirname, 'src', 'utils/currency/index.js'),
        'date-time': path.resolve(__dirname, 'src', 'utils/date-time/index.js'),
        digits     : path.resolve(__dirname, 'src', 'utils/digits/index.js'),
        object     : path.resolve(__dirname, 'src', 'utils/object/index.js'),
        positions  : path.resolve(__dirname, 'src', 'utils/positions/index.js'),
        portfolio  : path.resolve(__dirname, 'src', 'utils/portfolio/index.js'),
    },
    output: {
        path         : path.resolve(__dirname, 'utils'),
        filename     : '[name].js',
        libraryExport: 'default',
        library      : ['deriv-shared', '[name]'],
        libraryTarget: 'umd',
    },
    optimization: {
        minimize: true,
    },
    module: {
        rules: [
            (!isServe ? {
                enforce: 'pre',
                test   : /\.(js)$/,
                exclude: [/node_modules/, /utils/, /translations/],
                loader : 'eslint-loader',
                options: {
                    fix: true,
                },
            } : {}),
            {
                test   : /\.(js)$/,
                exclude: /node_modules/,
                loader : 'babel-loader',
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/styles/*.scss', to: 'styles', flatten: true },
            { from: 'src/styles/index.js', to: 'index.js' },
            { from: 'src/loaders/deriv-components-loader.js', to: 'deriv-components-loader.js' },
        ]),
        new StyleLintPlugin({ fix: true }),
    ],
    externals: [
        {
            'babel-polyfill'  : 'babel-polyfill',
            'moment'          : 'moment',
            'deriv-components': 'deriv-components',
        },
        /^deriv-components\/.+$/,
    ],
};
