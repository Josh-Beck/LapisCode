import { getTerrformNode } from "./repoMapService";
import { GithubNode } from "./types/GithubNode";
import { parseTerrformHCL } from "./HCLParser";


(async (): Promise<void> => {
    let terrformNode: GithubNode = await getTerrformNode();
    let y: string = await parseTerrformHCL(terrformNode);
    
    console.log(terrformNode);
})();

function main(): number {
    console.log('Hello world!')
    return 0;
    // logic goes here ..
    }