module.exports = {
    extends: ['@deriv-com/eslint-config-deriv'],
    rules: {
        'global-require': 'off',
        indent: 'off',
        'default-param-last': 'warn',
        'no-confusing-arrow': 'warn',
        'no-unsafe-optional-chaining': 'warn',
        'class-methods-use-this': 'warn',
        'prefer-regex-literals': 'warn',
        'prefer-exponentiation-operator': 'warn',
        'no-restricted-exports': 'warn',
        'no-promise-executor-return': 'warn',
        'import/no-relative-packages': 'warn',
        'import/no-mutable-exports': 'warn',
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'react/prop-types': 'off',
            },
        },
        {
            files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
            extends: ['plugin:testing-library/react'],
            rules: {
                'testing-library/await-async-events': 'warn',
                'testing-library/no-wait-for-multiple-assertions': 'warn',
                'testing-library/no-wait-for-side-effects': 'warn',
                'testing-library/no-unnecessary-act': 'warn',
                'testing-library/prefer-presence-queries': 'warn',
                'testing-library/prefer-query-by-disappearance': 'warn',
                'testing-library/no-render-in-lifecycle': 'warn',
                'testing-library/no-manual-cleanup': 'warn',
                'jest-dom/prefer-checked': 'warn',
                'jest-dom/prefer-to-have-value': 'warn',
            },
        },
        {
            files: ['*.{ts,tsx}'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            extends: [
                'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
                'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
                'plugin:@typescript-eslint/recommended',
                'plugin:prettier/recommended',
                'plugin:react/recommended',
                'plugin:react/jsx-runtime', // Enables the new JSX transform runtime
            ],
            rules: {
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
                '@typescript-eslint/no-unsafe-declaration-merging': 'warn',
            },
            parserOptions: {
                ecmaversion: 2018,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                babelOptions: {
                    presets: ['@babel/preset-react', '@babel/preset-typescript'],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        '@babel/plugin-proposal-export-default-from',
                        '@babel/plugin-proposal-object-rest-spread',
                        '@babel/plugin-proposal-export-namespace-from',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-proposal-optional-chaining',
                        '@babel/plugin-proposal-nullish-coalescing-operator',
                    ],
                },
            },
            settings: {
                react: {
                    version: 'detect',
                },
                'import/resolver': {
                    typescript: {
                        // use an array
                        project: 'packages/**/tsconfig.json',
                    },
                    node: {
                        extensions: ['.ts', '.tsx'],
                        moduleDirectory: ['src', 'node_modules'],
                    },
                },
            },
        },
        {
            files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.test.ts', '**/*.test.tsx'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'warn',
            },
        },
    ],
};
