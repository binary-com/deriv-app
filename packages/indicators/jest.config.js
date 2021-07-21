const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
};
