const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const publisher_utils = require('@deriv/publisher/utils');

const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
const is_publishing = process.env.NPM_PUBLISHING_MODE === '1';

module.exports = function () {
    return {
        entry: {
            index: path.resolve(__dirname, 'src', 'index.ts'),
        },
        mode: is_release ? 'production' : 'development',
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: 'index.js',
            libraryExport: 'default',
            library: '@deriv/dashboard',
            libraryTarget: 'umd',
        },
        resolve: {
            alias: {
                Assets: path.resolve(__dirname, 'src/assets'),
                Components: path.resolve(__dirname, 'src/components'),
                Constants: path.resolve(__dirname, 'src/constants'),
                Services: path.resolve(__dirname, 'src/services'),
                Stores: path.resolve(__dirname, 'src/stores'),
                Types: path.resolve(__dirname, 'src/types'),
                Utils: path.resolve(__dirname, 'src/utils'),
                ...publisher_utils.getLocalDerivPackageAliases(__dirname, is_publishing),
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
                            loader: '@deriv/shared/src/loaders/react-import-loader.js',
                        },
                        {
                            loader: '@deriv/shared/src/loaders/deriv-trader-loader.js',
                        },
                        {
                            loader: '@deriv/shared/src/loaders/deriv-account-loader.js',
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
                        'style-loader',
                        ...(is_publishing
                            ? [
                                  {
                                      loader: MiniCssExtractPlugin.loader,
                                  },
                                  '@deriv/publisher/utils/css-unit-loader.js',
                              ]
                            : []),
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            },
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
                                // eslint-disable-next-line global-require, import/no-dynamic-require
                                resources: require('@deriv/shared/src/styles/index.js'),
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            // TODO: bundle dashboard assets with webpack visibility and add contenthash
            // to thier filename like other packages to avoid caching issue.
            ...(is_publishing ? [new MiniCssExtractPlugin({ filename: 'main.css' })] : []),
            // ...(is_release ? [] : [ new BundleAnalyzerPlugin({ analyzerMode: 'static' }) ]),
        ],
        optimization: {
            minimize: is_release,
            minimizer: is_release
                ? [
                      new TerserPlugin({
                          test: /\.js$/,
                          parallel: 2,
                      }),
                      new CssMinimizerPlugin()
                  ]
                : [],
        },
        devtool: is_release ? undefined : 'eval-cheap-module-source-map',
        externals: [
            {
                ...publisher_utils.getLocalDerivPackageExternals(__dirname, is_publishing, {
                    // Include these in both published (Binary Static) and non-published (Deriv.app) builds.
                    react: true,
                    'react-dom': true,

                    // Only include these in Binary Static as it doesn't have these dependencies.
                    classnames: !is_publishing,
                    mobx: !is_publishing,
                    'react-router': !is_publishing,
                    'react-router-dom': !is_publishing,
                }),
            },
        ],
    };
};
