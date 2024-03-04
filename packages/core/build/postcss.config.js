module.exports = {
    parser: 'postcss-scss',
    plugins: [
        require('postcss-rtlcss')(),
        {
            'postcss-preset-env': {},
        },
    ],
};
