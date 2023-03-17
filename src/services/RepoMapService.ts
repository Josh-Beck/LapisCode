import * as conf from '../config/defaultConfig.json';
import { getGithubOrgAndRepoFromURL, githubContentsURLBuilder, githubFetch } from "./GithubService";
import { GithubNode } from "../types/GithubNode";

export async function getTerrformNode(githubBaseURLInput: string, terraformFileURLInput: string ): Promise<GithubNode> {
    if(terraformFileURLInput) {
        return githubFetch<GithubNode>(terraformFileURLInput);
    } else {
        let urlArr: string[] = getGithubOrgAndRepoFromURL(
            githubBaseURLInput ? githubBaseURLInput : conf.githubUrl);
        
        let mainTerraformFile: GithubNode = await parseRepoForTerraform(urlArr[0],urlArr[1],"","",0);
        return mainTerraformFile;
    }
} 

//Recursive function to find Terraform folder or file
async function parseRepoForTerraform(org: string, repo: string, path: string, url: string, recurions: number): Promise<GithubNode> {
    if(recurions > conf.recursionMaximum) {
        console.log("Github file recursion has reached maximum depth.")
        return null as any;
    }

    let repoArrJson: GithubNode[] = url ? await githubFetch<GithubNode[]>(url) : await githubFetch<GithubNode[]>(githubContentsURLBuilder(org,repo,path)); 
    for (let i = 0; i < repoArrJson.length; i++) {
        //TODO allow directories to be returned
        if (conf.TerraformFileNames.includes(repoArrJson[i].name)){// || conf.TerraformDirectoryNames.includes(repoArrJson[i].name)){
            console.log("Found Terraform element: " + repoArrJson[i].name + ". Type: " + repoArrJson[i].type);
            return repoArrJson[i];
        }
        if (repoArrJson[i].type === "dir") {
            let returnFile: GithubNode = await parseRepoForTerraform(org,repo,path,repoArrJson[i].url,recurions + 1);
            if (returnFile) {
                return returnFile;
            }
        }
    }
    return null as any;
}

