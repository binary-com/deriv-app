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
            JurisdictionModal: 'Containers/jurisdiction-modal/jurisdiction-modal.tsx',
            CFDPasswordModal: 'Containers/cfd-password-modal.tsx',
            CFDDbviOnBoarding: 'Containers/cfd-dbvi-onboarding.tsx',
            CFDResetPasswordModal: 'Containers/cfd-reset-password-modal.tsx',
            CFDServerErrorDialog: 'Containers/cfd-server-error-dialog.tsx',
            CFDTopUpDemoModal: 'Containers/cfd-top-up-demo-modal.tsx',
            MT5TradeModal: 'Containers/mt5-trade-modal.tsx',
            TradeModal: 'Containers/ctrader-derivx-trade-modal.tsx',
            MT5MigrationModal: 'Containers/mt5-migration-modal',
            CFDPasswordManagerModal: 'Containers/cfd-password-manager-modal.tsx',
            CFDFinancialStpRealAccountSignup: 'Containers/cfd-financial-stp-real-account-signup.tsx',
            getDXTradeWebTerminalLink: 'Helpers/constants.ts',
            getCTraderWebTerminalLink: 'Helpers/constants.ts',
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
                'mobx-react': 'mobx-react',
                '@deriv/shared': '@deriv/shared',
                '@deriv/components': '@deriv/components',
                '@deriv/translations': '@deriv/translations',
                '@deriv/account': '@deriv/account',
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
