import * as conf from './config/defaultConfig.json';
import * as secrets from './secrets/secrets.json';
import { GithubNode } from "./types/GithubNode";

console.log("URL from config" + conf.githubUrl)

export async function githubContents(org: string, repo: string, path: string): Promise<GithubNode[]> {
    console.log("before1");
    let url: string = "https://api.github.com/repos/"+org+"/"+repo+"/contents";///"+path;
    console.log(url)
    return await fetch(url,{
        headers: {
            "Accept": "application/vnd.github.v3+json" ,
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": "Bearer " + secrets.githubAPIToken
          }
    }).then((resp) => resp.json()).then((data) => {
        console.log(data);
        return data;
    }).catch(function(error) {
        console.log("error "+error);
        return "{}";
    });
}

export async function githubFetch<T>(url: string): Promise<T> {
    return await fetch(url,{
        headers: {
            "Accept": "application/vnd.github.v3+json" ,
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": "Bearer " + secrets.githubAPIToken
          }
    }).then((resp) => resp.json()).then((data) => {
        console.log(data);
        return data;
    }).catch(function(error) {
        console.log("error "+error);
        return "{}";
    });
}

export function getGithubOrgAndRepoFromURL(url: string): string[] {
    let urlArr: string[] = conf.githubUrl.split("/");
    let org: string = urlArr[3];
    let repo: string = urlArr[4];
    return [org,repo]
}