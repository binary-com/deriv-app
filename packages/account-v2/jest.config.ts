import baseConfigForPackages from '../../jest.config.base';

export default {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '^src(.*)$': '<rootDir>/src$1',
        '@deriv/api-v2': '<rootDir>/../api-v2/src',
        '\\.css$': '<rootDir>/../../__mocks__/styleMock.js',
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/fileMock.js',
    },
    transformIgnorePatterns: ['/node_modules/(?!(@deriv-com/ui)).+\\.js$'],
};
