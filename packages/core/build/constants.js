const CircularDependencyPlugin = require('circular-dependency-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const IgnorePlugin = require('webpack').IgnorePlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;

const {
    copyConfig,
    cssConfig,
    htmlInjectConfig,
    htmlOutputConfig,
    htmlPreloadConfig,
    stylelintConfig,
    generateSWConfig,
} = require('./config');
const {
    css_loaders,
    file_loaders,
    html_loaders,
    js_loaders,
    svg_file_loaders,
    svg_loaders,
} = require('./loaders-config');

const IS_RELEASE = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

const HOISTED_PACKAGES = {
    react: path.resolve(__dirname, '../../../node_modules/react'),
    'react-dom': path.resolve(__dirname, '../../../node_modules/react-dom'),
    'react-router': path.resolve(__dirname, '../../../node_modules/react-router'),
    'react-router-dom': path.resolve(__dirname, '../../../node_modules/react-router-dom'),
    mobx: path.resolve(__dirname, '../../../node_modules/mobx'),
    'mobx-react': path.resolve(__dirname, '../../../node_modules/mobx-react'),
    '@deriv/shared': path.resolve(__dirname, '../node_modules/@deriv/shared'),
    '@deriv/components': path.resolve(__dirname, '../node_modules/@deriv/components'),
    '@deriv/translations': path.resolve(__dirname, '../node_modules/@deriv/translations'),
    '@deriv/deriv-charts': path.resolve(__dirname, '../../../node_modules/@deriv/deriv-charts'),
};

const ALIASES = {
    _common: path.resolve(__dirname, '../src/_common'),
    App: path.resolve(__dirname, '../src/App'),
    Assets: path.resolve(__dirname, '../src/Assets'),
    Constants: path.resolve(__dirname, '../src/Constants'),
    Fonts: path.resolve(__dirname, '../src/public/fonts'),
    Images: path.resolve(__dirname, '../src/public/images'),
    Modules: path.resolve(__dirname, '../src/Modules'),
    Sass: path.resolve(__dirname, '../src/sass'),
    Services: path.resolve(__dirname, '../src/Services'),
    Stores: path.resolve(__dirname, '../src/Stores'),
    Translations: path.resolve(__dirname, '../src/public/translations'),
    Utils: path.resolve(__dirname, '../src/Utils'),
    ...HOISTED_PACKAGES,
};

const rules = (is_test_env = false) => [
    {
        // https://github.com/webpack/webpack/issues/11467
        test: /\.m?js/,
        include: /node_modules/,
        resolve: {
            fullySpecified: false,
        },
    },
    {
        test: /\.(js|jsx)$/,
        exclude: is_test_env ? /node_modules/ : /node_modules|__tests__/,
        include: is_test_env ? /__tests__|src/ : /src/,
        use: js_loaders,
    },
    {
        test: /\.html$/,
        exclude: /node_modules/,
        use: html_loaders,
    },
    {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        exclude: /node_modules/,
        use: file_loaders,
    },
    {
        test: /\.svg$/,
        exclude: /node_modules/,
        include: /public\//,
        use: svg_file_loaders,
    },
    {
        test: /\.svg$/,
        exclude: /node_modules|public\//,
        use: svg_loaders,
    },
    is_test_env
        ? {
              test: /\.(sc|sa|c)ss$/,
              loaders: 'null-loader',
          }
        : {
              test: /\.(sc|sa|c)ss$/,
              use: css_loaders,
          },
];

const MINIMIZERS = !IS_RELEASE
    ? []
    : [
          new TerserPlugin({
              test: /\.js$/,
              exclude: /(smartcharts)/,
              parallel: 2,
          }),
          new CssMinimizerPlugin(),
      ];

const plugins = ({ base, is_test_env, env }) => {
    let is_dashboard = false;
    let is_qawolf = false;

    if (env.IS_DASHBOARD) {
        is_dashboard = !!JSON.parse(env.IS_DASHBOARD);
    }
    if (env.IS_QAWOLF) {
        is_qawolf = !!JSON.parse(env.IS_QAWOLF);
    }

    return [
        new DefinePlugin({
            'process.env.IS_DASHBOARD': is_dashboard,
            'process.env.IS_QAWOLF': is_qawolf,
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin(copyConfig(base)),
        new HtmlWebPackPlugin(htmlOutputConfig(IS_RELEASE)),
        new HtmlWebpackTagsPlugin(htmlInjectConfig()),
        new PreloadWebpackPlugin(htmlPreloadConfig()),
        new IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
        new MiniCssExtractPlugin(cssConfig()),
        new CircularDependencyPlugin({ exclude: /node_modules/, failOnError: true }),
        ...(IS_RELEASE
            ? []
            : [new WebpackManifestPlugin({ fileName: 'asset-manifest.json', filter: file => file.name !== 'CNAME' })]),
        ...(is_test_env && !env.mocha_only
            ? [new StylelintPlugin(stylelintConfig())]
            : [
                  new GenerateSW(generateSWConfig(IS_RELEASE)),
                  // ...(!IS_RELEASE ? [new BundleAnalyzerPlugin({ analyzerMode: 'static' })] : []),
              ]),
    ];
};

module.exports = {
    IS_RELEASE,
    ALIASES,
    plugins,
    rules,
    MINIMIZERS,
};
