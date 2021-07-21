/** This config file is for packages in monorepo
    Universal configurations should go here
 */

module.exports = {
    testRegex: "(/__tests__/.*|(\\.)(test|spec))\\.js?$",
    // This is needed to transform es modules imported from node_modules of the target component.
    transformIgnorePatterns: [
        "/node_modules/(?!react-virtualized).+\\.js$",
    ],
    setupFiles: [
        "<rootDir>/../../jest.setup.js",
    ],
    setupFilesAfterEnv:[
        "<rootDir>/../../setupTests.js",
    ],
};
