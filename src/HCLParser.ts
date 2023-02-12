import * as conf from './config/defaultConfig.json';

import { GithubNode } from "./types/GithubNode";
import { githubFetch } from "./githubService";
import { decode } from "./utils";
import { GithubContentNode } from "./types/GithubContentNode";
import { LambdaFunctionObject, LambdaFunctionTerraform } from "./types/terraformLambdaFunction";

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
    terraformObjectList = recurseTerraformFile(terraformJSON, terraformObjectList,0);

    return terraformObjectList;
}

function recurseTerraformFile(obj: any, returnArr: LambdaFunctionTerraform[],maxRecursions: number): LambdaFunctionTerraform[] {

    if (maxRecursions > conf.recursionMaximum){
        console.log("Terraform file recursion has reached maximum depth.");
        return null as any;
    }

    if (Object.keys(obj).includes("aws_lambda_function")){
        returnArr.push(createTerraformObjects(obj));
    }

    // Base case, JSON object lowest result is of type string.
    if(typeof (obj) !== 'string'){
        for(var i in obj) {
            if(isJSONObject(i)) {
                recurseTerraformFile(obj, returnArr, maxRecursions+1);
            } else {
                recurseTerraformFile(obj[i], returnArr, maxRecursions+1);
            }
        }
    }
    return returnArr;
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

//HCL parsing helper - Returns true for JSON Object, False for JSON array
function isJSONObject(obj: Object): Boolean {
    return typeof (obj) === 'object'
}

function HCLToJSON(str: string, base64Encoded?: Boolean) {
    return JSON.parse(HCLParser.parse(base64Encoded ? decode(str) : str));
}