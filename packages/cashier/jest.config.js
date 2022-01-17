const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^Stores/(.*)$': '<rootDir>/src/Stores/$1',
        '^_common/(.*)$': '<rootDir>/src/_common/$1',
        '^Config/(.*)$': '<rootDir>/src/Config/$1',
        '^Components/(.*)$': '<rootDir>/src/Components/$1',
    },
    testPathIgnorePatterns: ['/Routes/', '/Validator/'],
    coveragePathIgnorePatterns: [
        '/Routes/__tests__/',
        '/Validator/__tests__/',
        '<rootDir>/.eslintrc.js',
        '<rootDir>/jest.config.js',
        '<rootDir>/build',
        '<rootDir>/coverage/lcov-report',
        '<rootDir>/dist',
    ],
};
