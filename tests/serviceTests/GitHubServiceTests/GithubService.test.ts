import {describe, expect, test} from '@jest/globals';
import * as GithubService from '../../../src/services/GithubService';
import { GithubContentNode } from '../../../src/types/GithubContentNode';

describe('GitHub Service Tests', () => {
  
    test('GitHub Contents URL Builder', () => {
        expect(GithubService.githubContentsURLBuilder("x","y","z"))
        .toBe("https://api.github.com/repos/x/y/contents/z");
    });

    test('GitHub Fetch Generic Function', async () => {
        let data = await GithubService.githubFetch<GithubContentNode>("https://api.github.com/repos/Josh-Beck/LapisCode-Test-Code/contents/unitTests/GithubService/GithubFetchTest.md");
        
        expect(data.name).toBe("GithubFetchTest.md");
        expect(data.path).toBe('unitTests/GithubService/GithubFetchTest.md');
    });
}); 