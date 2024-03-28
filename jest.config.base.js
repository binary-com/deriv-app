/** This config file is for packages in monorepo
    Universal configurations should go here
 */

module.exports = {
    collectCoverage: false,
    collectCoverageFrom: [
        '**/*.{js,jsx,ts,tsx}',
        '!**/node_modules/**',
        '!**/dist/**',
        '!/integration-tests/',
        '!/component-tests/',
    ],
    coverageReporters: ['lcov'],
    coverageDirectory: './coverage/',
    testRegex: '(/__tests__/.*|(\\.)(test|spec))\\.(js|jsx|tsx|ts)?$',
    // This is needed to transform es modules imported from node_modules of the target component.
    transformIgnorePatterns: ['/node_modules/(?!(@enykeev/react-virtualized|@simplewebauthn/browser)).+\\.js$'],
    setupFiles: ['<rootDir>/../../jest.setup.js'],
    setupFilesAfterEnv: ['<rootDir>/../../setupTests.js'],
    testPathIgnorePatterns: ['/integration-tests/', '/component-tests/'],
};
