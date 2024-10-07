const { rule } = require('postcss');
const webpackConfig = require('./build/webpack.config-test.js');

module.exports = {
    extends: ['../../.eslintrc.js'],
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
    rules: {
        'import/no-extraneous-dependencies': ['off', { devDependencies: ['**/*.spec.*', '**/*.test.*', '**/*.d.ts*'] }],
        'simple-import-sort/imports': 'warn',
        'prettier/prettier': 'warn',
    },
};
