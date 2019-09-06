const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const is_serve = process.env.BUILD_MODE === 'serve';
const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

module.exports = {
    // entry: path.join(__dirname, 'src', 'index.js'),
    entry: {
        // index: path.join(__dirname, 'src', 'index.js'),
        autocomplete: path.resolve(__dirname, 'src', 'components/autocomplete/index.js'),
        button      : path.resolve(__dirname, 'src', 'components/button/index.js'),
        checkbox    : path.resolve(__dirname, 'src', 'components/checkbox/index.js'),
        dialog      : path.resolve(__dirname, 'src', 'components/dialog/index.js'),
        dropdown    : path.resolve(__dirname, 'src', 'components/dropdown/index.js'),
        form        : path.resolve(__dirname, 'src', 'components/form/index.js'),
        input       : path.resolve(__dirname, 'src', 'components/input/index.js'),
        label       : path.resolve(__dirname, 'src', 'components/label/index.js'),
        popover     : path.resolve(__dirname, 'src', 'components/popover/index.js'),
        modal       : path.resolve(__dirname, 'src', 'components/modal/index.js'),
    },
    output: {
        path         : path.resolve(__dirname, 'lib'),
        filename     : '[name].js',
        libraryExport: 'default',
        library      : ['deriv-component', '[name]'],
        libraryTarget: 'umd',
    },
    resolve: {
        alias: {
            Components: path.resolve(__dirname, 'src', 'components'),
        },
    },
    optimization: {
        minimize: true,
        // TODO enable splitChunks
        // splitChunks: {
        //     chunks: 'all'
        // }
    },
    devServer: {
        publicPath: '/dist/',
    },
    devtool: is_release ? 'source-map' : 'cheap-module-eval-source-map',
    module : {
        rules: [
            {
                test: /\.(s*)css$/,
                use : [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader : 'css-loader',
                        options: { sourceMap: true },
                    },
                    {
                        loader : 'sass-loader',
                        options: { sourceMap: true },
                    },
                    {
                        loader : 'sass-resources-loader',
                        options: {
                            resources: require('deriv-shared/utils/index.js'),
                        }
                    }
                ]
            },
            {  
                test: /\.svg$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                          template: (
                            { template },
                            opts,
                            { imports, componentName, props, jsx, exports }
                          ) => template.ast`
                            ${imports}
                            import IconBase from '../icon-base.jsx';
                            const ${componentName} = (${props}) => IconBase(${jsx});
                            export default ${componentName};
                          `,
                        },
                    },
                ],
            },
            (!is_serve ? {
                enforce: 'pre',
                test   : /\.(js|jsx)$/,
                exclude: [/node_modules/, /lib/],
                loader : 'eslint-loader',
                options: {
                    fix: true,
                },
            } : {}),
            {
                test   : /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader : 'babel-loader',
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new StyleLintPlugin({ fix: true }),
        new CopyPlugin([
            {
                from: path.resolve(__dirname, 'src', 'components/icon/icon-base.jsx'),
                to: path.resolve(__dirname, 'lib', 'icons/icon-base.jsx')
            },
        ]),
    ],
    externals: {
        formik: 'formik',
        mobx  : 'mobx',
        react : {
            root     : 'React',
            commonjs : 'react',
            commonjs2: 'react',
        },
        'react-dom': {
            commonjs : 'react-dom',
            commonjs2: 'react-dom',
            root     : 'ReactDOM',
        },
        'mobx-react': {
            commonjs : 'mobx-react',
            commonjs2: 'mobx-react',
            root     : 'mobxReact',
        },
        'babel-polyfill': 'babel-polyfill',
    },
};
