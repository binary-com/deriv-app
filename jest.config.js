module.exports = {
    clearMocks: true,
    projects: ['<rootDir>/packages/*/jest.config.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+/es/^.+$': 'babel-jest',
    },
    testRegex: ['__tests__', '.*.spec.js'],
    transformIgnorePatterns: ['/node_modules/(?!react-virtualized).+\\.js$'],
};
