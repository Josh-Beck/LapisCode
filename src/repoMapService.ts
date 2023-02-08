import * as conf from './config/defaultConfig.json';
import { splitGithubURL, githubContents } from "./githubService";


(async (): Promise<void> => {
    let urlArr: string[] = splitGithubURL(conf.githubUrl);

    interface GithubFile {
        name: string,
        path: string,
        url: string,
        type: string
    }
    
    console.log(urlArr)
    
    console.log("before");
    let repoMapString: string = await githubContents(urlArr[0],urlArr[1],"");
    let repoMapJson = JSON.parse(repoMapString);
    console.log("after");   

    var repoMap: GithubFile[] = [];

    console.log(repoMapJson.length)

    for (let i = 0; i < repoMapJson.length; i++) {
        let repo: GithubFile = {
            name: repoMapJson[i].name,
            path: repoMapJson[i].path,
            url: repoMapJson[i].url,
            type: repoMapJson[i].type
        }
        repoMap.push(repo);    
    }



// JSON.parse(repoMapJson).then((json) =>{
//     repoMap = {
//         name: json.name,
//         path: json.path,
//         url: json.url,
//         type: json.type
//     }
// })



    console.log(repoMap)
})
