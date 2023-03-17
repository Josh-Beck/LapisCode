import { GithubNode } from "../types/GithubNode";
import { githubFetch } from "../services/GithubService";
import { decode } from "../utils/Utils";
import { GithubContentNode } from "../types/GithubContentNode";
import { LambdaFunctionObject, LambdaFunctionTerraform } from "../types/TerraformLambdaFunction";
import { recurseObject } from '../services/RecursiveService';
var HCLParser = require("js-hcl-parser")

//Global variable for use in recursive function
let terraformObjectList: LambdaFunctionTerraform[] = [];

// Takes in terraform HCL file and parses into valid JSON Object 
export async function parseTerrformHCL(terraformNode: GithubNode): Promise<LambdaFunctionTerraform[]> {
    let terraformFile:GithubContentNode;

    //TODO create alternate methodology for handling directories. 
    //https://github.com/Josh-Beck/LapisCode/issues/2
    // if(terraformNode.type === "dir") {
    //     //terraformFile = ...
    // } else {
    terraformFile = await githubFetch<GithubContentNode>(terraformNode.url);
    // }

    let terraformJSON = HCLToJSON(terraformFile.content, true);
    
    recurseObject<LambdaFunctionTerraform>(
        terraformJSON, returnCriteriaForTerraform, createTerraformObjects, 0);

    return terraformObjectList;
}

function createTerraformObjects(obj: any) {
    /*
        Terraform object format
        { aws_lambda_function: [ { func_name: [{OBJECT}] } ] }
    */
    let lambdaFunctionName: string = Object.keys(obj.aws_lambda_function[0])[0];
    let lambdaFunction: LambdaFunctionObject = obj.aws_lambda_function[0][lambdaFunctionName][0];
    let lambdaFunctionTerraform: LambdaFunctionTerraform = {name: lambdaFunctionName, lambdaObject: lambdaFunction}

    terraformObjectList.push(lambdaFunctionTerraform);
}

function returnCriteriaForTerraform(obj:any):Boolean {
    return Object.keys(obj).includes("aws_lambda_function");
}

function HCLToJSON(str: string, base64Encoded?: Boolean) {
    return JSON.parse(HCLParser.parse(base64Encoded ? decode(str) : str));
}