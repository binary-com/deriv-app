const path = require('path');
const DefinePlugin = require('webpack').DefinePlugin;
const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        context: path.resolve(__dirname, '../src'),
        devtool: IS_RELEASE ? 'source-map' : 'eval-cheap-module-source-map',
        entry: {
            account: path.resolve(__dirname, '../src', 'index.tsx'),
            'address-details-config': 'Configs/address-details-config',
            'currency-selector-config': 'Configs/currency-selector-config',
            'currency-radio-button-group': 'Components/currency-selector/radio-button-group.tsx',
            'currency-radio-button': 'Components/currency-selector/radio-button.tsx',
            'financial-details-config': 'Configs/financial-details-config',
            'get-status-badge-config': 'Configs/get-status-badge-config',
            'personal-details-config': 'Configs/personal-details-config',
            'poi-poa-docs-submitted': 'Components/poi-poa-docs-submitted/poi-poa-docs-submitted',
            'risk-tolerance-warning-modal': 'Components/trading-assessment/risk-tolerance-warning-modal',
            'sent-email-modal': 'Components/sent-email-modal',
            'terms-of-use-config': 'Configs/terms-of-use-config',
            'trading-assessment-config': 'Configs/trading-assessment-config',
            'test-warning-modal': 'Components/trading-assessment/test-warning-modal',
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
            splitChunks: {
                automaticNameDelimiter: '~',
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    defaultVendors: {
                        idHint: 'vendors',
                        priority: -10,
                        test: /[\\/]node_modules[\\/]/,
                    },
                },
                chunks: 'all',
                maxAsyncRequests: 30,
                maxInitialRequests: 3,
                minChunks: 1,
                minSize: 102400,
                minSizeReduction: 102400,
            },
        },
        output: {
            filename: 'account/js/[name].js',
            publicPath: base,
            path: path.resolve(__dirname, '../dist'),
            chunkFilename: 'account/js/account.[name].[contenthash].js',
            libraryExport: 'default',
            library: '@deriv/account',
            libraryTarget: 'umd',
        },
        externals: [
            {
                react: 'react',
                'react-dom': 'react-dom',
                'react-router-dom': 'react-router-dom',
                'react-router': 'react-router',
                formik: 'formik',
                classnames: 'classnames',
                '@deriv/shared': '@deriv/shared',
                '@deriv/components': '@deriv/components',
                '@deriv/translations': '@deriv/translations',
                '@deriv-com/analytics': '@deriv-com/analytics',
                '@deriv/api': '@deriv/api',
                '@deriv/hooks': '@deriv/hooks',
                '@deriv/stores': '@deriv/stores',
                '@deriv/utils': '@deriv/utils',
                '@deriv/quill-icons': `@deriv/quill-icons`,
                '@deriv-com/utils': '@deriv-com/utils',
                '@deriv-com/translations': '@deriv-com/translations',
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/components\/.+$/,
            /^@deriv\/translations\/.+$/,
        ],
        target: 'web',
        plugins: [
            ...plugins(base, false),
            new DefinePlugin({
                'process.env.SID_CALLBACK_URL': JSON.stringify(process.env.SID_CALLBACK_URL),
                'process.env.SID_PARTNER_ID': JSON.stringify(process.env.SID_PARTNER_ID),
                'process.env.SID_SANDBOX_URL': JSON.stringify(process.env.SID_SANDBOX_URL),
            }),
        ],
    };
};
