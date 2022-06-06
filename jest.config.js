module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
    coverageReporters: ['lcov'],
    coverageDirectory: './coverage/',
    clearMocks: true,
    projects: ['<rootDir>/packages/*/jest.config.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+/es/^.+$': 'babel-jest',
    },
    testRegex: ['__tests__', '.*.spec.js', '(/__tests__/.*|(\\.)(test|spec))\\.(js|tsx)?$'],
    transformIgnorePatterns: ['/node_modules/(?!react-virtualized).+\\.js$'],
};
