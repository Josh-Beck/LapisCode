import {describe, expect, test} from '@jest/globals';
import { resourceLimits } from 'worker_threads';

describe('GitHub Service Tests', () => {
    
    test('GitH URL Builder', () => {

        let result:GithubNode = await GithubService.getGithubFileFromWebsiteURL("https://github.com/Josh-Beck/LapisCode-Test-Code/blob/main/unitTests/GithubService/GithubURLTest.md");

        expect(result.name).toBe("GithubURLTest.md");
        

    });


}); 