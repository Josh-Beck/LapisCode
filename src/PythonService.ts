import { getGithubFileFromWebsiteURL, githubFetch } from "./GithubService";
import { GithubNode } from "./types/GithubNode";
import { ReadLine } from "readline";
import { GithubContentNode } from "./types/GithubContentNode";
import { decode } from "./utils/Utils";
import { Variable } from "./types/fileParsing/Variable";
import { DefinedVariable } from "./types/fileParsing/DefinedVariable";
import { ParameterVariable } from "./types/fileParsing/ParameterVariable";
import { DefinedFunction } from "./types/fileParsing/DefinedFunction";
import { CalledFunction } from "./types/fileParsing/CalledFunction";
import { Conditional } from "./types/fileParsing/Conditional";
import { ParsedFile } from "./types/fileParsing/ParsedFile";


export async function getPythonFile(pythonFile: GithubNode): Promise<string[]> {
    let pythonFileContents: GithubContentNode = await githubFetch<GithubContentNode>(pythonFile.url);
    let fileLines: string[] = decode(pythonFileContents.content).split("\n");

    return fileLines;
}

export async function getPythonHandlerFile(pythonHandlerURL: string): Promise<GithubNode> {
    if(pythonHandlerURL) {
        return await getGithubFileFromWebsiteURL(pythonHandlerURL);
    } else {
        // TODO - search for python handler
        console.log("MISSING PYTHON SEARCH FUNCTIONALITY.")
        return null as any;
    }
}

export async function parsePythonFile(pythonFileLines:string[]): Promise<string> {

    let variableMap:Map<string,Variable> = new Map<string, Variable>();
    let defFunctionArr:DefinedFunction[] =[];
    let calledFunctionArr:CalledFunction[] = [];
    let conditionalArr:Conditional[] = [];
    let paramVar: ParameterVariable[] = [];
    let defVar: DefinedVariable[] = [];
    let parsedFile:ParsedFile;

    for(let i:number = 0; i < pythonFileLines.length; i++ ){
        if(pythonFileLines[i]){
            let args:string[] = trimmedFileLineToArray(pythonFileLines[i]);
            console.log(args)
            if (args[0][0] === "#"){
                //Ignore, comment
            } else if (args[0] === "import") {
                if(args.length == 2){ // import <FUNC>
                    //defFunctionArr.push(new DefinedFunction(args[1]));
                } else if(args.length == 4) { //import <MODULE> as <FUNC>
                    //defFunctionArr.push(new DefinedFunction(args[3]));
                }
            } else if (args[0] === "from") { // from <MODULE> import <FUNC>
                let functionNameArr:string[] = args.slice(3)
                for(var funcIter in functionNameArr) {
                    //defFunctionArr.push(new DefinedFunction(functionNameArr[funcIter]));
                }
            } else if (args[0] === "def") {
                // def function case
                //How to handle varName = "default value"

                //funcName(firstVar
                let argsSubArr:string[] = args[1].split("(");
                //funcName
                //let defFunc:DefinedFunction = new DefinedFunction(argsSubArr[0]);

                if (args[1].slice(-3) !== "():") { //Function definition has atleast 1 parameter
                    //defFunc.parameterNames.push(argsSubArr[1]);
                    //defVar.push(new ParameterVariable(argsSubArr[1]));

                    
                    let remainingParams:string[] = args.slice(2)
                    for(var param in remainingParams) {
                        let paramName:string = remainingParams[param].slice(-2) === "):" ? remainingParams[param].slice(0,-2) : remainingParams[param];

                        if (paramName && 
                        !(paramName.includes("=") || paramName.includes('"') || paramName.includes("'") || paramName === "None")) {
                            //defFunc.parameterNames.push(paramName);
                            //defVar.push(new ParameterVariable(paramName));
                        }
                    }
                }
                //defFunctionArr.push(defFunc)

            } else if(args[1] === "=") { //Regular variable declaration
                //let newVar:DefinedVariable = new DefinedVariable(args[0]);
                //variableMap.set(newVar.name,newVar);
            } else if (args[0] === "if" || args[0] === "elif") {
                console.log(args)
                let cond:Conditional = new Conditional();

            } else if (args[0] === "else"){
                //Skip
            }
        } 
    }

    parsedFile = {
        variableList:variableMap,
        defFunctionList:defFunctionArr,
        calledFunctionList:calledFunctionArr,
        conditional:conditionalArr
    };

    console.log(parsedFile)
    return "TODO";
}

function trimmedFileLineToArray(line:string): string[]{
        //Consider removing for function scoping
        let lineTrimmed:string = line.trim();

        //Splits string on space and ,
        //let args:string[] = lineTrimmed.split(/[\s,()]+/);
        let args:string[] = lineTrimmed.split(/[\s,]+/);
        return args;
}

