const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.(css|s(c|a)ss)$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/fileMock.js',
    },
    transform: {
        '\\.(ts|tsx)?$': '<rootDir>/jestTransformer.js',
        '^.+\\.jsx?$': 'babel-jest',
    },
};
