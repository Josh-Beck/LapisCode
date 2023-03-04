import { getTerrformNode } from "./RepoMapService";
import { GithubNode } from "./types/GithubNode";
import { parseTerrformHCL } from "./HCLParser";
import { LambdaFunctionTerraform } from "./types/TerraformLambdaFunction";
import { getGithubFileFromWebsiteURL, getGithubFileNames } from "./GithubService";
//import { getPythonFile, parsePythonFile } from "./PythonService";
import { prepVulnerabilityData, scan } from "./vulnerabilities/VulnerabilityService";
import { handleJSFile } from "./JavascriptParser";
import { GithubContentNode } from "./types/GithubContentNode";
import { FileNode } from "./types/fileParsing/FileNode";
const { Command } = require('commander');

(async (): Promise<void> => {
    // Top level async import statements

    var cli = new Command();

    cli.name("Lapis").description("Lambda API Security");

    cli.command('scan').description('Submit a basic scan.')
    .option('-u, --url', 'Base Github URL. Defaults to configuration file URL.')
    .option('-t, --terraform <string>' , 'Terraform main.tf file URL.')
    .option('--handler <string>' , 'Python lambda handler file URL.')
    //.option('-a, --auth <string>', 'Python gateway authorizer file')
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

    let parsedAndPreppedJSFile:FileNode[] = await handleJSFile(options.handler);
    //console.log("RESULTS")
    //console.log(parsedAndPreppedJSFile)
    var fs = require('fs');
    await fs.writeFile ("./build/javascriptFileBuildResults.json", JSON.stringify(parsedAndPreppedJSFile), function(err:any) {
        if (err) throw err;
            console.log('complete');
        }
    );

    let finished:boolean = scan(parsedAndPreppedJSFile);

    //Handle finding/fetching python handler file
    // let pythonFile:GithubNode = await getGithubFileFromWebsiteURL(options.handler);
    // console.log(pythonFile)
    
    //Handle Parsing Python file.
    //let parsedPythonFile:string[] = await getPythonFile(pythonFile);

    //console.log(parsedPythonFile);

    // Pull out file information
    /*let todo:string = *///parsePythonFile(parsedPythonFile);


    //Handle parsing vulnerability specifications


    //Handle parsing files and vuln specs
    //prepVulnerabilityData();
    
    //Report vulnerabilities

    }