import * as conf from './config/defaultConfig.json';
import { splitGithubURL, githubContents } from "./githubService";

//console.log("Here");


export async function mapRepo(): Promise<string> {
    let urlArr: string[] = splitGithubURL(conf.githubUrl);

    interface GithubFile {
        name: string,
        path: string,
        url: string,
        type: string
    }

    console.log(urlArr)

    console.log("before");

    let repoMapJson: GithubFile[] = await githubContents(urlArr[0],urlArr[1],"");
   //let repoMapJson = JSON.parse(repoMapString);

    console.log(repoMapJson[0].name)
    console.log("after");   

    var repoMap: GithubFile[] = [];

    // console.log(repoMapJson.length)

    // for (let i = 0; i < repoMapJson.length; i++) {
    //     let repo: GithubFile = {
    //         name: repoMapJson[i].name,
    //         path: repoMapJson[i].path,
    //         url: repoMapJson[i].url,
    //         type: repoMapJson[i].type
    //     }
    //     repoMap.push(repo);    
    // }



// JSON.parse(repoMapJson).then((json) =>{
//     repoMap = {
//         name: json.name,
//         path: json.path,
//         url: json.url,
//         type: json.type
//     }
// })



    console.log("End of function " + repoMap)
    return JSON.stringify(repoMap);
} 



