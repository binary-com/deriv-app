const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const isRelease =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

const svgLoaders = [
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
                floatPrecision: 3,
                plugins: [
                    { removeTitle: false },
                    { removeUselessStrokeAndFill: false },
                    { removeUnknownsAndDefaults: false },
                    { removeViewBox: false },
                ],
            },
        },
    },
];

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        devtool: isRelease ? 'source-map' : 'eval-cheap-module-source-map',
        entry: {
            index: path.resolve(__dirname, './src', 'index.tsx'),
        },
        externals: [
            {
                classnames: true,
                react: true,
                'react-dom': true,
                'react-router-dom': true,
            },
        ],
        mode: isRelease ? 'production' : 'development',
        module: {
            rules: [
                {
                    // https://github.com/webpack/webpack/issues/11467
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false,
                    },
                    test: /\.m?js/,
                },
                {
                    exclude: /node_modules/,
                    test: /\.(js|jsx|ts|tsx)$/,
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
                    loader: 'source-map-loader',
                    test: input => isRelease && /\.js$/.test(input),
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
                                keepQuery: true,
                                sourceMap: true,
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
                                ],
                            },
                        },
                    ],
                },
                {
                    exclude: /node_modules/,
                    generator: {
                        filename: 'tradershub/assets/[name].[contenthash][ext]',
                    },
                    include: /assets\//,
                    issuer: /\/packages\/tradershub\/.*(\/)?.*.scss/,
                    test: /\.svg$/,
                    type: 'asset/resource',
                },
                {
                    exclude: /node_modules/,
                    include: /assets\//,
                    issuer: /\/packages\/tradershub\/.*(\/)?.*.tsx/,
                    test: /\.svg$/,
                    use: svgLoaders,
                },
            ],
        },
        optimization: {
            minimize: isRelease,
            minimizer: isRelease
                ? [
                      new TerserPlugin({
                          parallel: 2,
                          test: /\.js$/,
                      }),
                      new CssMinimizerPlugin(),
                  ]
                : [],
            splitChunks: {
                automaticNameDelimiter: '~',
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        minSize: 102400,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    defaultVendors: {
                        idHint: 'vendors',
                        priority: -10,
                        test: /[\\/]node_modules[\\/]/,
                    },
                    shared: {
                        chunks: 'all',
                        name: 'shared',
                        test: /[\\/]shared[\\/]/,
                    },
                },
                chunks: 'all',
                enforceSizeThreshold: 500000,
                maxAsyncRequests: 30,
                maxInitialRequests: 3,
                minChunks: 1,
                minSize: 102400,
                minSizeReduction: 102400,
            },
        },
        output: {
            chunkFilename: 'tradershub/js/tradershub.[name].[contenthash].js',
            filename: 'tradershub/js/[name].js',
            library: '@deriv/tradershub',
            libraryExport: 'default',
            libraryTarget: 'umd',
            path: path.resolve(__dirname, './dist'),
            publicPath: base,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@cfd': path.resolve(__dirname, 'src/features/cfd'),
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
    };
};
