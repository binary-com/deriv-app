module.exports = {
    extends: '../../.eslintrc.js',
    globals: {
        Blockly: false,
        trackJs: false,
        jest: false,
        dataLayer: false,
        goog: false,
        google: false,
        gapi: false,
        __webpack_public_path__: false,
    },
    settings: {
        react: {
            version: '16',
        },
    },
    rules: {
        'no-underscore-dangle': 0,
        'simple-import-sort/imports': 'warn',
    },
};
