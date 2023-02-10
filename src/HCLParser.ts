import { GithubNode } from "./types/GithubNode";
import {githubFetch } from "./githubService";

var HCLParser = require("js-hcl-parser")


// Takes in HCL string, parses out something...
export async function parseTerrformHCL(terraformNode: GithubNode): Promise<string> {
    console.log("HERE!")
    console.log(terraformNode)
    if(terraformNode.type === "dir") {
        // Figure out how to do this with dirs
    } else {
        let x:string = await githubFetch(terraformNode.url);
    }
    //HCLParser.parse(input);
    return "x";
}




const hclInput = `
scale {
    from = 72
    to = 24
}
`
 
const jsonInput = `
{
"scale": {
    "from": 72,
    "to": 8
}
}
`
var x = HCLParser.parse(hclInput);
console.log(x)

console.log(JSON.parse(x)["scale"][0]["from"])
console.log(JSON.parse(x).scale[0].from)