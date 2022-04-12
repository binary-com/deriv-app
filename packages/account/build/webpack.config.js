const path = require('path');
const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');

module.exports = function (env, argv) {
    const base = env && env.base && env.base != true ? '/' + env.base + '/' : '/';

    return {
        context: path.resolve(__dirname, '../src'),
        devtool: IS_RELEASE ? undefined : 'eval-cheap-module-source-map',
        entry: {
            account: path.resolve(__dirname, '../src', 'index.tsx'),
            'accept-risk-config': 'Configs/accept-risk-config',
            'account-limits': 'Components/account-limits',
            'address-details': 'Components/address-details',
            'address-details-config': 'Configs/address-details-config',
            'api-token': 'Components/api-token',
            'currency-selector': 'Components/currency-selector',
            'currency-selector-config': 'Configs/currency-selector-config',
            'currency-selector-schema': 'Configs/currency-selector-schema',
            'currency-radio-button-group': 'Components/currency-selector/radio-button-group.jsx',
            'currency-radio-button': 'Components/currency-selector/radio-button.jsx',
            'demo-message': 'Components/demo-message',
            'error-component': 'Components/error-component',
            'file-uploader-container': 'Components/file-uploader-container',
            'financial-assessment': 'Sections/Profile/FinancialAssessment',
            'financial-details': 'Components/financial-details',
            'financial-details-config': 'Configs/financial-details-config',
            'form-body': 'Components/form-body',
            'form-footer': 'Components/form-footer',
            'form-sub-header': 'Components/form-sub-header',
            'icon-message-content': 'Components/icon-message-content',
            'leave-confirm': 'Components/leave-confirm',
            'load-error-message': 'Components/load-error-message',
            'poa-expired': 'Components/poa-expired',
            'poa-needs-review': 'Components/poa-needs-review',
            'poa-status-codes': 'Components/poa-status-codes',
            'poa-submitted': 'Components/poa-submitted',
            'poa-unverified': 'Components/poa-unverified',
            'poa-verified': 'Components/poa-verified',
            'personal-details': 'Components/personal-details',
            'personal-details-config': 'Configs/personal-details-config',
            'poi-expired': 'Components/poi-expired',
            'poi-missing-personal-details': 'Components/poi-missing-personal-details',
            'poi-onfido-failed': 'Components/poi-onfido-failed',
            'poi-unsupported': 'Components/poi-unsupported',
            'poi-unverified': 'Components/poi-unverified',
            'poi-upload-complete': 'Components/poi-upload-complete',
            'poi-verified': 'Components/poi-verified',
            'proof-of-identity': 'Sections/Verification/ProofOfIdentity/proof-of-identity.jsx',
            'proof-of-identity-container': 'Sections/Verification/ProofOfIdentity/proof-of-identity-container.jsx',
            'proof-of-address-container': 'Sections/Verification/ProofOfAddress/proof-of-address-container.jsx',
            'reset-trading-password-modal': 'Components/reset-trading-password-modal',
            'self-exclusion': 'Components/self-exclusion',
            'scrollbars-container': 'Components/scrollbars-container',
            'sent-email-modal': 'Components/sent-email-modal',
            'text-container': 'Components/text-container',
            'terms-of-use': 'Components/terms-of-use',
            'terms-of-use-config': 'Configs/terms-of-use-config',
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
                mobx: 'mobx',
                'mobx-react': 'mobx-react',
                '@deriv/shared': '@deriv/shared',
                '@deriv/components': '@deriv/components',
                '@deriv/translations': '@deriv/translations',
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/components\/.+$/,
            /^@deriv\/translations\/.+$/,
        ],
        target: 'web',
        plugins: plugins(base, false),
    };
};
