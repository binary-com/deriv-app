const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '\\.(jpg|jpeg|png)$': '<rootDir>/../../__mocks__/fileMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^Assets/(.*)$': '<rootDir>/src/Assets/$1',
        '^Components/(.*)$': '<rootDir>/src/Components/$1',
        '^Constants/(.*)$': '<rootDir>/src/Constants/$1',
        '^Configs/(.*)$': '<rootDir>/src/Configs/$1',
        '^Containers/(.*)$': '<rootDir>/src/Containers/$1',
        '^Duplicated/(.*)$': '<rootDir>/src/Duplicated/$1',
        '^Helpers/(.*)$': '<rootDir>/src/Helpers/$1',
        '^Services/(.*)$': '<rootDir>/src/Services/$1',
        '^Stores/(.*)$': '<rootDir>/src/Stores/$1',
        '^Sections/(.*)$': '<rootDir>/src/Sections/$1',
        '^Sections$': '<rootDir>/src/Sections/index.js',
    },
};
