const CircularDependencyPlugin = require('circular-dependency-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const IgnorePlugin = require('webpack').IgnorePlugin;
const TerserPlugin = require('terser-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const Dotenv = require('dotenv-webpack');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
//TODO: Uncomment this line when type script migrations on all packages done
//const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const is_release =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

const svg_loaders = [
    {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
            rootMode: 'upward',
        },
    },
    {
        loader: 'react-svg-loader',
        options: {
            jsx: true,
            svgo: {
                plugins: [
                    { removeTitle: false },
                    { removeUselessStrokeAndFill: false },
                    { removeUknownsAndDefaults: false },
                ],
                floatPrecision: 3,
            },
        },
    },
];

// TODO: Uncomment this line when type script migrations on all packages done
// const default_plugins = [new CleanWebpackPlugin(), new ForkTsCheckerWebpackPlugin()];
const default_plugins = [
    // new BundleAnalyzerPlugin(),
    new Dotenv(),
    new DefinePlugin({
        'process.env.TRUSTPILOT_API_KEY': JSON.stringify(process.env.TRUSTPILOT_API_KEY),
        'process.env.REMOTE_CONFIG_URL': JSON.stringify(process.env.REMOTE_CONFIG_URL),
    }),
    new IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
    new CircularDependencyPlugin({ exclude: /node_modules/, failOnError: true }),
];
const prod_plugins = [
    ...default_plugins,
    new MiniCssExtractPlugin({
        filename: 'appstore/css/[name].[contenthash].css',
        chunkFilename: 'appstore/css/[name].[contenthash].css',
    }),
];
const dev_plugins = [...default_plugins];
const plugins = is_release ? prod_plugins : dev_plugins;

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        entry: {
            index: path.resolve(__dirname, 'src', 'index.tsx'),
        },
        mode: is_release ? 'production' : 'development',
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: base,
            filename: 'appstore/js/[name].js',
            libraryExport: 'default',
            library: '@deriv/appstore',
            libraryTarget: 'umd',
            chunkFilename: 'appstore/js/appstore.[name].[contenthash].js',
        },
        resolve: {
            alias: {
                Assets: path.resolve(__dirname, 'src/assets'),
                Components: path.resolve(__dirname, 'src/components'),
                Constants: path.resolve(__dirname, 'src/constants'),
                Modules: path.resolve(__dirname, 'src/modules'),
                Services: path.resolve(__dirname, 'src/services'),
                Stores: path.resolve(__dirname, 'src/stores'),
                Types: path.resolve(__dirname, 'src/types'),
                Utils: path.resolve(__dirname, 'src/utils'),
                Hooks: path.resolve(__dirname, 'src/hooks'),
                Helpers: path.resolve(__dirname, 'src/helpers'),
            },
            extensions: ['.ts', '.tsx', '.js'],
        },
        module: {
            rules: [
                {
                    // https://github.com/webpack/webpack/issues/11467
                    test: /\.m?js/,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: '@deriv/shared/src/loaders/deriv-trader-loader.js',
                        },
                        {
                            loader: '@deriv/shared/src/loaders/deriv-account-loader.js',
                        },
                        {
                            loader: '@deriv/shared/src/loaders/deriv-cashier-loader.js',
                        },
                        {
                            loader: '@deriv/shared/src/loaders/deriv-cfd-loader.js',
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                rootMode: 'upward',
                            },
                        },
                    ],
                },
                {
                    test: input => is_release && /\.js$/.test(input),
                    loader: 'source-map-loader',
                },
                {
                    test: /\.(sc|sa|c)ss$/,
                    use: [
                        is_release ? MiniCssExtractPlugin.loader : 'style-loader',
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    config: path.resolve(__dirname),
                                },
                            },
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: true,
                                keepQuery: true,
                            },
                        },
                        'sass-loader',
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                // Provide path to the file with resources
                                resources: [
                                    // eslint-disable-next-line global-require, import/no-dynamic-require
                                    ...require('@deriv/shared/src/styles/index.js'),
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    exclude: [/node_modules/, path.resolve('../', 'wallets')],
                    include: /public\//,
                    type: 'asset/resource',
                    generator: {
                        filename: 'appstore/public/[name].[contenthash][ext]',
                    },
                },
                {
                    test: /\.svg$/,
                    exclude: /node_modules|public\//,
                    use: svg_loaders,
                },
            ],
        },
        optimization: {
            minimize: is_release,
            minimizer: is_release
                ? [
                      new TerserPlugin({
                          test: /\.js$/,
                          parallel: 2,
                      }),
                      new CssMinimizerPlugin(),
                  ]
                : [],
        },
        devtool: is_release ? 'source-map' : 'eval-cheap-module-source-map',
        externals: [
            {
                react: true,
                'react-dom': true,
                classnames: true,
                mobx: true,
                'react-router': true,
                'react-router-dom': true,
                '@deriv/shared': true,
                '@deriv/components': true,
                '@deriv/translations': true,
                '@deriv/account': true,
                '@deriv/cashier': true,
                '@deriv/cfd': true,
                '@deriv-com/analytics': `@deriv-com/analytics`,
                '@deriv-com/translations': '@deriv-com/translations',
            },
        ],
        plugins,
    };
};
