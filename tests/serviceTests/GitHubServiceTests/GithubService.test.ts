import {describe, expect, test} from '@jest/globals';
import { resourceLimits } from 'worker_threads';
import * as GithubService from '../../../src/services/GithubService';
import { GithubContentNode } from '../../../src/types/GithubContentNode';
import { GithubNode } from '../../../src/types/GithubNode';

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

    test('GitHub Org and Repo from URL ', () => {
        let result:string[] = GithubService.getGithubOrgAndRepoFromURL("https://github.com/Josh-Beck/LapisCode/tree/main");

        expect(result[0]).toBe("Josh-Beck");
        expect(result[1]).toBe("LapisCode");
    });

    test('Github File From Website URL', async () => {
        let result:GithubNode = await GithubService.getGithubFileFromWebsiteURL("https://github.com/Josh-Beck/LapisCode-Test-Code/blob/main/unitTests/GithubService/GithubURLTest.md");

        expect(result.name).toBe("GithubURLTest.md");
        expect(result.type).toBe("file");
    });
}); 