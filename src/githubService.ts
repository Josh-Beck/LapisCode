import * as conf from './config/defaultConfig.json';

console.log("URL from config" + conf.githubUrl)

let urlArr: string[] = conf.githubUrl.split("/");
let org: string = urlArr[3];
let repo: string = urlArr[4];

console.log(org + " " + repo)

fetch("https://api.github.com/repos/"+org+repo+"/contents",{
    headers: {
        "Accept": "application/vnd.github+json" ,
        "Authorization": "Bearer <YOUR-TOKEN>"
      }
}).then((resp) => resp.json()).then((data) =>{
    console.log(data);
});
