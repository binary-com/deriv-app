const webpackConfig = require('./build/webpack.config-test');

module.exports = {
    extends: '../../.eslintrc.js',
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
    rules: {
        'simple-import-sort/imports': 'warn',
        'prettier/prettier': 'warn',
    },
};
