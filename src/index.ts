import { getTerrformNode } from "./repoMapService";
import { GithubNode } from "./types/GithubNode";
import { parseTerrformHCL } from "./HCLParser";
import { LambdaFunctionTerraform } from "./types/terraformLambdaFunction";


(async (): Promise<void> => {
    let terrformNode: GithubNode = await getTerrformNode();
    let lambdaFunctionTerraformList: LambdaFunctionTerraform[] = await parseTerrformHCL(terrformNode);
    console.log(lambdaFunctionTerraformList);
    //Python Parser
    //Vulnerability Parser
})();

function main(): number {
    console.log('Hello world!')
    return 0;
    // logic goes here ..
    }