module.exports = {
    extends: '../../.eslintrc.js',
    rules: {
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'simple-import-sort/imports': 'warn',
    },
};
