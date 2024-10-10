const path = require('path');
const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        context: path.resolve(__dirname, '../'),
        devtool: IS_RELEASE ? 'source-map' : 'eval-cheap-module-source-map',
        entry: {
            cfd: path.resolve(__dirname, '../src', 'index.tsx'),
            CFDStore: 'Stores/Modules/CFD/cfd-store',
            CFDPasswordModal: 'Containers/cfd-password-modal.tsx',
            CFDResetPasswordModal: 'Containers/cfd-reset-password-modal.tsx',
            CFDServerErrorDialog: 'Containers/cfd-server-error-dialog.tsx',
            CFDTopUpDemoModal: 'Containers/cfd-top-up-demo-modal.tsx',
            MT5TradeModal: 'Containers/mt5-trade-modal.tsx',
            MT5MigrationModal: 'Containers/mt5-migration-modal',
            CFDPasswordManagerModal: 'Containers/cfd-password-manager-modal.tsx',
            CTraderTransferModal: 'Containers/ctrader-transfer-modal',
        },
        mode: IS_RELEASE ? 'production' : 'development',
        module: {
            rules: rules(),
        },
        resolve: {
            alias: ALIASES,
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        optimization: {
            chunkIds: 'named',
            moduleIds: 'named',
            minimize: IS_RELEASE,
            minimizer: MINIMIZERS,
            usedExports: true,
            splitChunks: {
                automaticNameDelimiter: '~',
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    defaultVendors: {
                        chunks: 'all',
                        idHint: 'vendors',
                        priority: -10,
                        test: /[\\/]node_modules[\\/]/,
                    },
                    assets: {
                        chunks: 'all',
                        name: 'assets',
                        test: /[\\/]Assets[\\/]/,
                        enforce: true,
                    },
                    internalCFDStoreUsage: {
                        name: 'internalCFDStoreUsage',
                        test: module => {
                            const isStoreModule = module.resource && module.resource.includes('Stores');
                            return isStoreModule;
                        },
                        chunks: chunk => chunk.name !== 'CFDStore', // Do not include if chunk is CFDStore
                        enforce: true,
                    },
                    utilities: {
                        name: 'utilities',
                        test: module => {
                            // Access the resource path of the module
                            const { resource } = module;
                            if (!resource) return false;

                            // Define inclusion patterns for Helpers and Constants directories
                            const includePatterns = [
                                /[\\/]Helpers[\\/]/, // Include Helpers directory
                                /[\\/]Constants[\\/]/, // Include Constants directory
                            ];

                            // Define exclusion patterns to ensure other directories are not included
                            const excludePatterns = [
                                /[\\/]Stores[\\/]/, // Since there is a Helpers directory inside Stores, the Stores directory has been excluded.
                            ];

                            // Check if the module should be included
                            const shouldBeIncluded = includePatterns.some(pattern => pattern.test(resource));

                            // Check if the module should be excluded
                            const shouldBeExcluded = excludePatterns.some(pattern => pattern.test(resource));

                            return shouldBeIncluded && !shouldBeExcluded;
                        },
                        chunks: 'all',
                        enforce: true,
                    },
                },
                minChunks: 1,
                minSize: 35000,
                minSizeReduction: 40000,
            },
        },
        output: {
            filename: 'cfd/js/[name].js',
            publicPath: base,
            path: path.resolve(__dirname, '../dist'),
            chunkFilename: 'cfd/js/cfd.[name].[contenthash].js',
            libraryExport: 'default',
            library: '@deriv/cfd',
            libraryTarget: 'umd',
        },
        externals: [
            {
                react: 'react',
                'react-dom': 'react-dom',
                'react-router-dom': 'react-router-dom',
                'react-router': 'react-router',
                mobx: 'mobx',
                '@deriv/shared': '@deriv/shared',
                '@deriv/components': '@deriv/components',
                '@deriv/translations': '@deriv/translations',
                '@deriv/account': '@deriv/account',
                '@deriv-com/translations': '@deriv-com/translations',
                '@deriv-com/analytics': '@deriv-com/analytics',
                '@deriv-com/utils': '@deriv-com/utils',
                '@deriv/api': '@deriv/api',
                '@deriv/api-types': '@deriv/api-types',
                '@deriv/hooks': '@deriv/hooks',
                '@deriv/stores': '@deriv/stores',
                formik: 'formik',
                'react-transition-group': 'react-transition-group',
                classnames: 'classnames',
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/components\/.+$/,
            /^@deriv\/translations\/.+$/,
            /^@deriv\/account\/.+$/,
        ],
        target: 'web',
        plugins: plugins(base, false),
    };
};
