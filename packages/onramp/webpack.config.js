const publisher_utils = require('@deriv/publisher/utils');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin    = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
const is_publishing = process.env.NPM_PUBLISHING_MODE === '1';

module.exports = function () {
    return {
        entry: {
            index: path.resolve(__dirname, 'src/components', 'app.jsx'),
        },
        mode: is_release ? 'production' : 'development',
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: 'index.js',
            libraryExport: 'default',
            library: '@deriv/onramp',
            libraryTarget: 'umd',
        },
        resolve: {
            alias: {
                Components: path.resolve(__dirname, 'src/components'),
                Stores: path.resolve(__dirname, 'src/stores'),
                ...publisher_utils.getLocalDerivPackageAliases(__dirname, is_publishing),
            },
            symlinks: false,
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
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: '@deriv/shared/src/loaders/react-import-loader.js',
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
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    config: path.resolve(__dirname),
                                },
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
                      new OptimizeCssAssetsPlugin(),
                  ]
                : [],
        },
        devtool: is_release ? undefined : 'eval-cheap-module-source-map',
        externals: [
            {
                react: 'react',
                'react-dom': 'react-dom',
                'prop-types': 'prop-types',
                ...(is_publishing ? {} : { formik: 'formik' }),
                ...publisher_utils.getLocalDerivPackageExternals(__dirname, is_publishing),
            },
        ],
    };
};
