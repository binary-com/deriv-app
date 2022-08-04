const path = require('path');

const resources = [
    'constants.scss',
    'mixins.scss',
    'fonts.scss',
    'inline-icons.scss',
    'devices.scss',
    'responsive.module.scss',
];

module.exports = resources.map(file => path.resolve(__dirname, file));
