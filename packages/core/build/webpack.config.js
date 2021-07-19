const path = require('path');
const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');
const { openChromeBasedOnPlatform } = require('./helpers');

module.exports = function (env) {
    console.log(`Building application for ${env.IS_DASHBOARD === 'true' ? 'Deriv Dashboard' : 'Deriv App'}...`);
    const base = env && env.base && env.base !== true ? '/' + env.base + '/' : '/';
    const sub_path = env && env.open && env.open !== true ? env.open : '';
    const is_qawolf = env && env.IS_QAWOLF && JSON.parse(env.IS_QAWOLF);

    return {
        context: path.resolve(__dirname, '../src'),
        devServer: {
            publicPath: base,
            open: openChromeBasedOnPlatform(process.platform),
            openPage: sub_path,
            host: is_qawolf ? 'localhost' : 'localhost.binary.sx',
            https: !is_qawolf,
            port: is_qawolf ? 3000 : 443,
            historyApiFallback: true,
            stats: {
                colors: true,
            },
        },
        devtool: IS_RELEASE ? undefined : 'eval-cheap-module-source-map',
        entry: './index.js',
        mode: IS_RELEASE ? 'production' : 'development',
        module: {
            rules: rules(),
        },
        resolve: {
            alias: ALIASES,
            extensions: ['.js', '.jsx'],
            symlinks: true,
        },
        optimization: {
            minimize: IS_RELEASE,
            minimizer: MINIMIZERS,
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                maxSize: 240000,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    defaultVendors: {
                        idHint: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                },
            },
        },
        output: {
            filename: 'js/core.[name].[contenthash].js',
            publicPath: base,
            path: path.resolve(__dirname, '../dist'),
        },
        plugins: plugins({
            base,
            is_test_env: false,
            env,
        }),
    };
};
