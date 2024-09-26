const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
//upato/check--bundle-size

const IS_RELEASE =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

const output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bot/js/bot-web-ui.main.js',
    chunkFilename: 'bot/js/bot.[name].[contenthash].js',
    libraryExport: 'default',
    library: '@deriv/bot-web-ui',
    libraryTarget: 'umd',
};

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        entry: [path.join(__dirname, 'src', 'app', 'index.ts')],
        output: {
            ...output,
            publicPath: base,
        },
        devServer: {
            publicPath: '/dist/',
            disableHostCheck: true,
        },
        mode: IS_RELEASE ? 'production' : 'development',
        devtool: IS_RELEASE ? 'source-map' : 'eval-cheap-module-source-map',
        target: 'web',
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
                    test: /\.(s*)css$/,
                    use: [
                        'css-hot-loader',
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: !IS_RELEASE,
                                url: false,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: !IS_RELEASE },
                        },
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: require('@deriv/shared/src/styles/index.js'),
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'svg-sprite-loader',
                            options: {
                                extract: true,
                                spriteFilename: 'bot-sprite.svg',
                            },
                        },
                        {
                            loader: 'svgo-loader',
                            options: {
                                plugins: [{ removeUselessStrokeAndFill: false }, { removeUnknownsAndDefaults: false }],
                            },
                        },
                    ],
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        rootMode: 'upward',
                    },
                },
                {
                    // @deriv/bot-skeleton also requires `.xml` import statements to be parsed by raw-loader
                    test: /\.xml$/,
                    exclude: /node_modules/,
                    use: 'raw-loader',
                },
            ],
        },
        resolve: {
            alias: {
                Components: path.resolve(__dirname, 'src', 'components'),
                Constants: path.resolve(__dirname, './src/constants'),
                Stores: path.resolve(__dirname, './src/stores'),
                Utils: path.resolve(__dirname, './src/utils'),
                Types: path.resolve(__dirname, 'src/types'),
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        plugins: [
            new Dotenv(),
            new DefinePlugin({
                'process.env.GD_CLIENT_ID': JSON.stringify(process.env.GD_CLIENT_ID),
                'process.env.GD_API_KEY': JSON.stringify(process.env.GD_API_KEY),
                'process.env.GD_APP_ID': JSON.stringify(process.env.GD_APP_ID),
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'process.env.REF_NAME': JSON.stringify(process.env.REF_NAME),
                'process.env.REMOTE_CONFIG_URL': JSON.stringify(process.env.REMOTE_CONFIG_URL),
            }),
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: 'bot/css/bot.main.[contenthash].css',
                chunkFilename: 'bot/css/bot.[name].[contenthash].css',
            }),
            new StyleLintPlugin({ fix: true }),
            new CopyWebpackPlugin({
                patterns: [{ from: 'node_modules/@deriv/bot-skeleton/dist/media', to: 'bot/media' }],
            }),
            new SpriteLoaderPlugin(),
        ],
        externals: [
            {
                '@babel/polyfill': '@babel/polyfill',
                classnames: 'classnames',
                '@deriv/components': '@deriv/components',
                '@deriv/shared': '@deriv/shared',
                '@deriv/translations': '@deriv/translations',
                formik: 'formik',
                react: 'react',
                mobx: 'mobx',
                'mobx-react': 'mobx-react',
                'react-dom': 'react-dom',
                '@deriv/deriv-charts': '@deriv/deriv-charts',
                '@deriv-com/analytics': `@deriv-com/analytics`,
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/components\/.+$/,
            /^@deriv\/translations\/.+$/,
            /^@deriv\/analytics\/.+$/,
        ],
    };
};
