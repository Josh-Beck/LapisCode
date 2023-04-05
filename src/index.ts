import { getTerrformNode } from "./services/RepoMapService";
import { GithubNode } from "./types/GithubNode";
import { parseTerrformHCL } from "./parsers/HCLParser";
import { LambdaFunctionTerraform } from "./types/TerraformLambdaFunction";
import { scan } from "./vulnerabilities/VulnerabilityService";
import { handleJSFile } from "./parsers/JavascriptParser";
import { FileNode } from "./types/fileParsing/FileNode";
import { Result } from "./types/results/Result";
import { handleResults } from "./reporting/Results";
import { writeFile } from "./services/FileService";
const { Command } = require('commander');

(async (): Promise<void> => {
    var cli = new Command();

    cli.name("Lapis").description("Lambda API Security");

    cli.command('scan').description('Submit a basic scan.')
    .option('-u, --url <string>', 'Base Github URL. Defaults to configuration file URL.')
    .option('-t, --terraform <string>' , 'Terraform main.tf file URL.')
    .option('--handler <string>' , 'Lambda handler file URL.')
    .option('-a, --auth <string>', 'Gateway authorizer file')
    .action((options: any) => {
        main(options);
    });
    
    cli.parse();
})();

async function main(options: any) {

    //Handle finding/fetching terraform file
    let terrformNode: GithubNode = await getTerrformNode(options.url, options.terraform);
    console.log(terrformNode)

    //Handle Parsing Terraform file.
    let lambdaFunctionTerraformList: LambdaFunctionTerraform[] = await parseTerrformHCL(terrformNode);
    console.log(lambdaFunctionTerraformList);

    //Create FileNode Objects from Javascript code
    let parsedAndPreppedJSFile:FileNode[] = await handleJSFile(options.handler);
    await writeFile("./build/javascriptFileBuildResults.json", parsedAndPreppedJSFile);

    //Create FileNode Objects from Javascript code
    let parsedAndPreppedAuthorizerFile:FileNode[] = await handleJSFile(options.auth);
    await writeFile("./build/javascriptAuthorizerFileBuildResults.json", parsedAndPreppedAuthorizerFile);

    let fileList:FileNode[][] = [];
    fileList.push(parsedAndPreppedAuthorizerFile,parsedAndPreppedJSFile);
    //Scan results for vulnerabilities
    let resultList:Result[] = scan(fileList);
    
    //Deliver results
    handleResults(resultList);
}