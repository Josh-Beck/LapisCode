import * as conf from './config/defaultConfig.json';
import * as secrets from './secrets/secrets.json';

console.log("URL from config" + conf.githubUrl)

let urlArr: string[] = conf.githubUrl.split("/");
let org: string = urlArr[3];
let repo: string = urlArr[4];

interface GithubFile {
    name: string,
    path: string,
    url: string,
    type: string
}

console.log(org + " " + repo)

githubContents(org,repo,"");

export async function githubContents(org: string, repo: string, path: string): Promise<GithubFile[]> {
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
        // return JSON.stringify(data);
        return data;
    }).catch(function(error) {
        console.log("error "+error);
        return "{}";
    });
}

export function splitGithubURL(url: string): string[] {
    let urlArr: string[] = conf.githubUrl.split("/");
    let org: string = urlArr[3];
    let repo: string = urlArr[4];
    return [org,repo]
}