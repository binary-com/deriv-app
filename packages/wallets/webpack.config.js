const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

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
        devtool: is_release ? 'source-map' : 'eval-cheap-module-source-map',
        entry: {
            index: path.resolve(__dirname, './src', 'index.tsx'),
        },
        externals: [
            {
                '@deriv/quill-icons': `@deriv/quill-icons`,
                '@deriv/shared': '@deriv/shared',
                '@deriv/utils': '@deriv/utils',
                '@deriv-com/analytics': '@deriv-com/analytics',
                '@deriv-com/translations': '@deriv-com/translations',
                '@deriv-com/utils': '@deriv-com/utils',
                classnames: true,
                react: true,
                'react/jsx-runtime': true,
                'react-dom': true,
                'react-router-dom': true,
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/translations\/.+$/,
        ],
        mode: is_release ? 'production' : 'development',
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
                    test: input => is_release && /\.js$/.test(input),
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
                                    // eslint-disable-next-line global-require, import/no-dynamic-require
                                    ...require('./src/styles/index.js'),
                                ],
                            },
                        },
                    ],
                },
                {
                    exclude: /node_modules/,
                    generator: {
                        filename: 'wallets/public/[name].[contenthash][ext]',
                    },
                    include: /public\//,
                    issuer: /\/packages\/wallets\/.*(\/)?.*.scss/,
                    test: /\.svg$/,
                    type: 'asset/resource',
                },
                {
                    exclude: /node_modules/,
                    include: /public\//,
                    issuer: /\/packages\/wallets\/.*(\/)?.*.tsx/,
                    test: /\.svg$/,
                    use: svg_loaders,
                },
            ],
        },
        optimization: {
            minimize: is_release,
            minimizer: is_release
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
                    components: {
                        name: 'components',
                        test: module => {
                            return module.resource && module.resource.includes('src/components/Base');
                        },
                    },
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
            chunkFilename: 'wallets/js/wallets.[name].[contenthash].js',
            filename: 'wallets/js/[name].js',
            library: '@deriv/wallets',
            libraryExport: 'default',
            libraryTarget: 'umd',
            path: path.resolve(__dirname, './dist'),
            publicPath: base,
        },
        plugins: [
            new DefinePlugin({
                'process.env.CROWDIN_URL': JSON.stringify('https://translations.deriv.com'),
                'process.env.REMOTE_CONFIG_URL': JSON.stringify(process.env.REMOTE_CONFIG_URL),
                'process.env.WALLETS_TRANSLATION_PATH': JSON.stringify('deriv-app-wallets/staging'),
            }),
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
    };
};
