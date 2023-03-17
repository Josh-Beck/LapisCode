"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const GithubService_1 = require("../../../src/services/GithubService");
(0, globals_1.describe)('GitHub Service Tests', () => {
    (0, globals_1.test)('GitHub Contents URL Builder', () => {
        (0, globals_1.expect)((0, GithubService_1.githubContentsURLBuilder)("x", "y", "z"))
            .toBe("https://api.github.com/repos/x/y/contents/z");
    });
});
