const webpackConfig = require('./webpack.config.js');

module.exports = {
    env: { es6: true },
    extends: ['../../.eslintrc.js', 'eslint:recommended', 'plugin:react/recommended'],
    overrides: [
        {
            files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
            rules: {
                'no-undef': 'off',
            },
        },
    ],
    parserOptions: { sourceType: 'module' },
    plugins: ['eslint-plugin-local-rules', 'simple-import-sort', 'sort-destructure-keys', 'typescript-sort-keys'],
    root: true,
    rules: {
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/sort-type-constituents': 'error',
        camelcase: 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/no-extraneous-dependencies': ['off', { devDependencies: ['**/*.spec.*', '**/*.test.*', '**/*.d.ts*'] }],
        'lines-around-comment': ['error', { allowObjectStart: true }],
        'local-rules/no-react-namespace': 'error',
        'no-unneeded-ternary': 'error',
        'no-unsafe-optional-chaining': 'warn',
        'no-useless-return': 'error',
        'object-shorthand': 'error',
        'prefer-const': 'error',
        'react/jsx-pascal-case': 'error',
        'react/jsx-sort-props': 'error',
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    [
                        'public-path',
                        // `react` first, then packages starting with a character
                        '^react$',
                        '^[a-z]',
                        // Packages starting with `@`
                        '^@',
                        // Imports starting with `../`
                        '^\\.\\.(?!/?$)',
                        '^\\.\\./?$',
                        // Imports starting with `./`
                        '^\\./(?=.*/)(?!/?$)',
                        '^\\.(?!/?$)',
                        '^\\./?$',
                        // Style imports
                        '^.+\\.s?css$',
                        // Side effect imports
                        '^\\u0000',
                        // Delete the empty line copied as the next line of the last import
                        '\\s*',
                    ],
                ],
            },
        ],
        'sort-destructure-keys/sort-destructure-keys': 'error',
        'sort-keys': 'error',
        'typescript-sort-keys/interface': 'error',
        'typescript-sort-keys/string-enum': 'error',
    },
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
};
