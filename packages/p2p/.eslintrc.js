const webpackConfig = require('./webpack.config');

module.exports = {
    extends: '../../.eslintrc.js',
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig() },
        },
    },
    rules: {
        'simple-import-sort/imports': 'warn',
    },
};
