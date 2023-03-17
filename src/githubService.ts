import * as conf from './config/defaultConfig.json';
import * as secrets from './secrets/secrets.json';
import { GithubNode } from "./types/GithubNode";

export function githubContentsURLBuilder(org: string, repo: string, path: string): string {
    return "https://api.github.com/repos/"+org+"/"+repo+"/contents/"+ path;
}

// TODO For future, change repo parser to use trees
// https://github.com/Josh-Beck/LapisCode/issues/10
export async function getGithubFileNames(): Promise<string[]> {
    let url: string = "https://api.github.com/repos/Josh-Beck/LapisCode/git/trees/main?recursive=3";
    let x: Object = await githubFetch<Object>(url);
    // List of file names or filenode objects (ideally)
    return [""];
}

export async function githubFetch<T>(url: string): Promise<T> {
    return await fetch(url,{
        headers: {
            "Accept": "application/vnd.github.v3+json" ,
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": "Bearer " + secrets.githubAPIToken
          }
    }).then((resp) => resp.json()).then((data) => {
        return data;
    }).catch(function(error) {
        console.log("error "+ error);
        return "{}";
    });
}

export function getGithubOrgAndRepoFromURL(url: string): string[] {
    let urlArr: string[] = conf.githubUrl.split("/");
    let org: string = urlArr[3];
    let repo: string = urlArr[4];
    return [org,repo]
}

// Currently only works on `main` branch
export async function getGithubFileFromWebsiteURL(url: string): Promise<GithubNode> {
    let path: string = url.split("/main/")[1];
    let urlArr: string[] = getGithubOrgAndRepoFromURL(url);

    let returnFile:GithubNode = await githubFetch<GithubNode>(
        githubContentsURLBuilder(urlArr[0],urlArr[1],path)); 

    return returnFile;
}