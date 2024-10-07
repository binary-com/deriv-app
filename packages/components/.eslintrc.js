const webpackConfig = require('./webpack.config');

module.exports = {
    extends: '../../.eslintrc.js',
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'react/prop-types': 'off',
            },
        },
        {
            files: ['./src/components/icon/icons-manifest.js'],
            rules: {
                quotes: 'off',
            },
        },
    ],
    settings: {
        react: {
            version: '16',
        },
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
    rules: {
        'simple-import-sort/imports': 'warn',
    },
};
