const webpackConfig = require('./build/webpack.config.js');

module.exports = {
    extends: ['../../.eslintrc.js'],
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
    rules: {
        'import/no-extraneous-dependencies': ['off', { devDependencies: ['**/*.spec.*'] }],
        'simple-import-sort/imports': 'warn',
        'prettier/prettier': 'warn',
    },
};
