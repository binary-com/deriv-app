const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^Components/(.*)$': '<rootDir>/src/Components/$1',
        '^Constants/(.*)$': '<rootDir>/src/Constants/$1',
        '^Configs/(.*)$': '<rootDir>/src/Configs/$1',
        '^Duplicated/(.*)$': '<rootDir>/src/Duplicated/$1',
        '^Services/(.*)$': '<rootDir>/src/Services/$1',
        '^Stores/(.*)$': '<rootDir>/src/Stores/$1',
        '^Sections/(.*)$': '<rootDir>/src/Sections/$1',
        '^Sections$': '<rootDir>/src/Sections/index.js',
    },
};
