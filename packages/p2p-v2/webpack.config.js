const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const is_release =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        entry: {
            index: path.resolve(__dirname, './src', 'index.tsx'),
        },
        mode: is_release ? 'production' : 'development',
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: base,
            filename: 'p2p-v2/js/[name].js',
            libraryExport: 'default',
            library: '@deriv/p2p-v2',
            libraryTarget: 'umd',
            chunkFilename: 'p2p-v2/js/p2p-v2.[name].[contenthash].js',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
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
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                rootMode: 'upward',
                            },
                        },
                    ],
                },
                //TODO: Uncomment this line when type script migrations on all packages done
                // plugins: [new CleanWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
                {
                    test: input => is_release && /\.js$/.test(input),
                    loader: 'source-map-loader',
                },
                {
                    test: /\.(sc|sa|c)ss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                url: true,
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
                                resources: [
                                    // eslint-disable-next-line global-require, import/no-dynamic-require
                                    ...require('../shared/src/styles/index.js'),
                                    // eslint-disable-next-line global-require, import/no-dynamic-require
                                    // ...require('./src/styles/index.js'),
                                ],
                            },
                        },
                    ],
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
            splitChunks: {
                chunks: 'all',
                minSize: 102400,
                minSizeReduction: 102400,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                enforceSizeThreshold: 500000,
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        minSize: 102400,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    defaultVendors: {
                        idHint: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                    shared: {
                        test: /[\\/]shared[\\/]/,
                        name: 'shared',
                        chunks: 'all',
                    },
                },
            },
        },
        devtool: is_release ? 'source-map' : 'eval-cheap-module-source-map',
        externals: [
            {
                react: true,
                'react-dom': true,
                classnames: true,
                'react-router-dom': true,
            },
        ],
    };
};
