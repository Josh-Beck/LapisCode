import * as conf from './config/defaultConfig.json';

import { GithubNode } from "./types/GithubNode";
import { githubFetch } from "./GithubService";
import { decode } from "./utils/Utils";
import { GithubContentNode } from "./types/GithubContentNode";
import { LambdaFunctionObject, LambdaFunctionTerraform } from "./types/TerraformLambdaFunction";
import { recurseObject } from './RecursiveService';
var HCLParser = require("js-hcl-parser")


// Takes in terraform HCL file and parses into valid JSON Object 
export async function parseTerrformHCL(terraformNode: GithubNode): Promise<LambdaFunctionTerraform[]> {
    let terraformFile:GithubContentNode;

    //TODO create alternate methodology for handling directories. 
    // if(terraformNode.type === "dir") {
    //     // Figure out how to do this with dirs
    //     //terraformFile = {"content":"hey"};
    // } else {
        terraformFile = await githubFetch<GithubContentNode>(terraformNode.url);
    // }

    let terraformJSON = HCLToJSON(terraformFile.content, true);
    let terraformObjectList: LambdaFunctionTerraform[] = [];
    
    terraformObjectList = recurseObject<LambdaFunctionTerraform>(
        terraformJSON, returnCriteriaForTerraform, createTerraformObjects, terraformObjectList, 0);

    return terraformObjectList;
}

function createTerraformObjects(obj: any):LambdaFunctionTerraform {
    /*
        Terraform object format
        { aws_lambda_function: [ { func_name: [{OBJECT}] } ] }
    */
    let lambdaFunctionName: string = Object.keys(obj.aws_lambda_function[0])[0];
    let lambdaFunction: LambdaFunctionObject = obj.aws_lambda_function[0][lambdaFunctionName][0];
    let lambdaFunctionTerraform: LambdaFunctionTerraform = {name: lambdaFunctionName, lambdaObject: lambdaFunction}

    return lambdaFunctionTerraform;
}

function returnCriteriaForTerraform(obj:any):Boolean {
    return Object.keys(obj).includes("aws_lambda_function");
}



function HCLToJSON(str: string, base64Encoded?: Boolean) {
    return JSON.parse(HCLParser.parse(base64Encoded ? decode(str) : str));
}