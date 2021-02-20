const path = require('path');
const stylelintFormatter = require('stylelint-formatter-pretty');
const { IS_RELEASE } = require('./constants');
const { transformContentUrlBase } = require('./helpers');

const copyConfig = base => {
    return {
        patterns: [
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/bot-web-ui/dist/bot-web-ui.main.css*'),
                to: 'css/',
                flatten: true,
            },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/bot-web-ui/dist/media/**'),
                to: 'js/bot/media',
                flatten: true,
            },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/dashboard/lib/assets/images'),
                to: 'js/dashboard/assets/images',
            },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/bot-web-ui/dist/*.*'),
                to: 'js/bot/',
                flatten: true,
            },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/trader/dist/js/smartcharts/**'),
                to: 'js/smartcharts/',
                flatten: true,
            },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/trader/dist/css/smartcharts.css*'),
                to: 'css/',
                flatten: true,
            },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/trader/dist/public/**'),
                to: 'public',
                transformPath(context) {
                    return context.split('node_modules/@deriv/trader/dist/')[1];
                },
            },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/account/dist/js/**'),
                to: 'account/js',
                flatten: true,
            },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/account/dist/css/**'),
                to: 'account/css/',
                flatten: true,
            },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/cashier/dist/js/**'),
                to: 'js',
                flatten: true,
            },
            { from: path.resolve(__dirname, '../node_modules/@deriv/cashier/dist/css/**'), to: 'css', flatten: true },
            { from: path.resolve(__dirname, '../node_modules/@deriv/cashier/dist/js/*.*'), to: 'js', flatten: true },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/cashier/dist/public/**'),
                to: 'public',
                transformPath(context) {
                    return context.split('node_modules/@deriv/cashier/dist/')[1];
                },
            },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/trader/dist/js/trader.*.js'),
                to: 'js',
                flatten: true,
            },
            { from: path.resolve(__dirname, '../node_modules/@deriv/trader/dist/css/**'), to: 'css', flatten: true },
            { from: path.resolve(__dirname, '../node_modules/@deriv/trader/dist/*.*'), to: 'js', flatten: true },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/translations/src/translations/*.*'),
                to: 'public/i18n',
                flatten: true,
            },
            { from: path.resolve(__dirname, '../scripts/CNAME'), to: 'CNAME', toType: 'file', noErrorOnMissing: true },
            { from: path.resolve(__dirname, '../src/root_files/404.html'), to: '404.html', toType: 'file' },
            {
                from: path.resolve(__dirname, '../src/root_files/localstorage-sync.html'),
                to: 'localstorage-sync.html',
                toType: 'file',
            },
            { from: path.resolve(__dirname, '../src/root_files/robots.txt'), to: 'robots.txt', toType: 'file' },
            { from: path.resolve(__dirname, '../src/root_files/sitemap.xml'), to: 'sitemap.xml', toType: 'file' },
            {
                from: path.resolve(__dirname, '../src/public/images/favicons/favicon.ico'),
                to: 'favicon.ico',
                toType: 'file',
            },
            { from: path.resolve(__dirname, '../src/public/images/favicons/**') },
            {
                from: path.resolve(__dirname, '../src/public/images/common/static_images/**'),
                to: 'public/images/common',
                flatten: true,
            },
            // { from: path.resolve(__dirname, '../src/public/images/common/og_image.gif'), to: 'images/common/og_image.gif' }, // Once the design for og_image is ready, bring this back.
            { from: path.resolve(__dirname, '../src/public/images/common/logos/platform_logos/**') },
            { from: path.resolve(__dirname, '../src/public/images/app/header/**') },
            {
                from: path.resolve(__dirname, '../node_modules/@deriv/components/lib/icon/sprite'),
                to: 'public/images/sprite',
                toType: 'dir',
            },

            {
                from: path.resolve(__dirname, '../src/templates/app/manifest.json'),
                to: 'manifest.json',
                toType: 'file',
                transform(content, path) {
                    return transformContentUrlBase(content, path, base);
                },
            },
            {
                from: path.resolve(__dirname, '../src/templates/app/apple-app-site-association.json'),
                to: 'apple-app-site-association',
                toType: 'file',
                transform(content, path) {
                    return transformContentUrlBase(content, path, base);
                },
            },
            {
                from: path.resolve(__dirname, '../src/templates/app/apple-app-site-association.json'),
                to: '.well-known/apple-app-site-association',
                toType: 'file',
                transform(content, path) {
                    return transformContentUrlBase(content, path, base);
                },
            },
        ],
        options: {
            concurrency: 100,
        },
    };
};

const generateSWConfig = () => ({
    cleanupOutdatedCaches: true,
    exclude: [/CNAME$/, /index\.html$/, /404\.html$/, /^localstorage-sync\.html$/, /\.map$/],
    skipWaiting: true,
    clientsClaim: true,
});

const htmlOutputConfig = () => ({
    template: 'index.html',
    filename: 'index.html',
    minify: !IS_RELEASE
        ? false
        : {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
          },
});

const htmlInjectConfig = () => ({
    links: [
        'css/smartcharts.css',
        'css/bot-web-ui.main.css',
        {
            path: 'manifest.json',
            attributes: {
                rel: 'manifest',
            },
        },
        {
            path: 'public/images/favicons',
            glob: '*',
            globPath: path.resolve(__dirname, '../src/public/images/favicons'),
            attributes: {
                rel: 'icon',
            },
        },
    ],
    append: false,
});

const htmlPreloadConfig = () => ({
    rel: 'preload',
    include: 'initial',
    as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.woff$/.test(entry)) return 'font';
        return 'script';
    },
    fileWhitelist: [/\.css$/],
});

const cssConfig = () => ({ filename: 'css/core.main.css', chunkFilename: 'css/core.[name].[contenthash].css' });

const stylelintConfig = () => ({
    configFile: path.resolve(__dirname, '../.stylelintrc.js'),
    formatter: stylelintFormatter,
    files: 'sass/**/*.s?(a|c)ss',
    failOnError: false, // Even though it's false, it will fail on error, and we need this to be false to display trace
});

module.exports = {
    copyConfig,
    htmlOutputConfig,
    htmlInjectConfig,
    htmlPreloadConfig,
    cssConfig,
    stylelintConfig,
    generateSWConfig,
};
