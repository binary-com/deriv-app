const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        "\\.s(c|a)ss$": "<rootDir>/../../__mocks__/styleMock.js",
        "^.+\\.svg$": "<rootDir>/../../__mocks__/styleMock.js",
    },
};
