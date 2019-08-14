const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
    // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
        test: /\.scss$/,
        use: [
            'style-loader',
            'css-loader',
            'sass-loader',
            {
                loader: 'sass-resources-loader',
                options: {
                    // Provide path to the file with resources
                    resources: require(path.resolve(__dirname, '../node_modules/deriv-shared/utils/index.js')),
                },
            },
        ],
    });

    config.module.rules.push({
        test: /\.stories\.js?$/,
        loaders: [
            {
                loader: require.resolve('@storybook/addon-storysource/loader'),
                options: { parser: 'javascript' },
            },
        ],
        enforce: 'pre',
    });

    // Return the altered config
    return config;
};
