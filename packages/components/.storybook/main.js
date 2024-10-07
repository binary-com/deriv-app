const path = require('path');
const CopyPlugin = require('copy-webpack-plugin-v6');

module.exports = {
    stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-webpack5',
    },
    webpackFinal: async config => {
        config?.module?.rules?.push({
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
                {
                    loader: 'sass-resources-loader',
                    options: {
                        // Provide path to the file with resources
                        resources: require('@deriv/shared/src/styles/index.js'),
                    },
                },
            ],
        });

        config.resolve.alias = {
            ...config.resolve?.alias,
            Components: path.resolve(__dirname, '../src/components'),
            Stories: path.resolve(__dirname, '../stories'),
            Shared: path.resolve(__dirname, './shared'),
        };

        config?.module?.rules?.push({
            resolve: {
                alias: {
                    Components: path.resolve(__dirname, '../src/components'),
                    Stories: path.resolve(__dirname, '../stories'),
                },
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        });
        config?.module?.rules?.push({
            test: /\.js[x]?$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        '@babel/plugin-proposal-export-default-from',
                        '@babel/plugin-proposal-object-rest-spread',
                        '@babel/plugin-proposal-export-namespace-from',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-proposal-optional-chaining',
                        '@babel/plugin-proposal-nullish-coalescing-operator',
                        ['@babel/plugin-transform-private-methods', { loose: true }],
                        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
                    ],
                },
            },
        });

        config?.plugins?.push(
            new CopyPlugin({
                patterns: [
                    { from: path.resolve(__dirname, '../lib/icon/sprites'), to: 'public/sprites', toType: 'dir' },
                ],
            })
        );
        // Return the altered config
        return config;
    },
};
