const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    clearMocks: true,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^Assets/(.*)$': '<rootDir>/src/assets/$1',
        '^Components/(.*)$': '<rootDir>/src/components/$1',
        '^Constants/(.*)$': '<rootDir>/src/constants/$1',
        '^Hooks$': '<rootDir>/src/hooks/index',
        '^Pages/(.*)$': '<rootDir>/src/pages/$1',
        '^Stores/(.*)$': '<rootDir>/src/stores/$1',
        '^Stores$': '<rootDir>/src/stores/index',
        '^Translations/(.*)$': '<rootDir>/src/translations/$1',
        '^Types/(.*)$': '<rootDir>/src/types/$1',
        '^Utils/(.*)$': '<rootDir>/src/utils/$1',
    },
    testPathIgnorePatterns: [
        '/scripts/',
        '/translations/',
        '/crowdin/',
        // TODO: Update the test files once the major features are done
        // This is a temporary change, I hope
        '/src/components/order-details*',
    ],
    coveragePathIgnorePatterns: [
        '<rootDir>/.eslintrc.js',
        '<rootDir>/jest.config.js',
        '<rootDir>/build',
        '<rootDir>/coverage/lcov-report',
        '<rootDir>/dist',
    ],
    transformIgnorePatterns: ['/node_modules/(?!(@sendbird/chat|@simplewebauthn/browser)).+\\.js$'],
};
