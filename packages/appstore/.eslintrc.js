const webpackConfig = require('./webpack.config');

module.exports = {
    extends: [
        '../../.eslintrc.js',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/no-var-requires': 0,
        'simple-import-sort/imports': 'warn',
        'prettier/prettier': 'warn',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                args: 'all',
                argsIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            },
        ],
    },
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
};
