/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: [".js"],
    "roots": [
        "<rootDir>/tests"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "coverageDirectory":"<rootDir>/build/coverage"
};