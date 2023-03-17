/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: [".js"],
    "roots": [
        "<rootDir>/src",
        "<rootDir>/tests"
      ],
      "transform": {
        "^.+\\.tsx?$": "ts-jest"
      },
};