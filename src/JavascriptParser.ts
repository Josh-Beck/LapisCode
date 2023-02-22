import { GithubNode } from "./types/GithubNode";
import { GithubContentNode } from "./types/GithubContentNode";
import { githubFetch,getGithubFileFromWebsiteURL } from "./GithubService";
import { decode } from "./utils/Utils";
import { FileNode } from "./types/fileParsing/FileNode";
import { recurseObject } from "./RecursiveService";
import * as acorn from "acorn";
import { DefinedVariable } from "./types/fileParsing/DefinedVariable";
import * as JSConst from "./constants/javascriptConstants"
import { DefinedFunction } from "./types/fileParsing/DefinedFunction";

export async function handleJSFile(url: string):Promise<FileNode[]> {
    let jsFileContents:GithubContentNode = await getJSFile(url);
    //console.log(jsFileContents);

    let parsedJSFile:Object = await parseJSFile(jsFileContents);
    //console.log(parsedJSFile);
    let parsedAndPreppedJSFile:FileNode[] = [];
    parsedAndPreppedJSFile = recurseObject<FileNode>(parsedJSFile, returnCriteriaFunction, recursionBaseFunction, parsedAndPreppedJSFile, 0);
    return parsedAndPreppedJSFile;
}

export async function getJSFile(url: string): Promise<GithubContentNode> {
    let jsFile:GithubNode = await getGithubFileFromWebsiteURL(url);
    
    let jsFileContents: GithubContentNode = await githubFetch<GithubContentNode>(jsFile.url);

    return jsFileContents;
}

export async function parseJSFile(fileContentNode:GithubContentNode):Promise<Object> {
    let jsFile: string = decode(fileContentNode.content);
    //console.log(jsFile)

    let parsedJSFile:Object = acorn.parse(jsFile, {ecmaVersion: 2020});

    return parsedJSFile;
}

export const FILE_NODE_PARSING:string[] = [
    JSConst.VAR_DECLARATION,
    JSConst.FUNC_DECLARATION
]

export function returnCriteriaFunction(obj:any):Boolean {
    return Object.values(obj).some((val) => typeof val === 'string' ? FILE_NODE_PARSING.includes(val) : false);
}

export function recursionBaseFunction(obj:any):FileNode {
    console.log("MADE IT TO BASE")
    switch(obj.type) { 
        case JSConst.VAR_DECLARATION: { 
            console.log("Var dec")
            let defVar:DefinedVariable = new DefinedVariable(obj.declarations[0].id.name,obj.type,obj.kind);
            console.log("CHECK")
            if(obj.declarations[0].init && obj.declarations[0].init.type === "MemberExpression") {
                defVar.init = memberExpressionHelper(obj.declarations[0].init)
            }
            
            return defVar;
        } 
        case JSConst.FUNC_DECLARATION: { 
            let paramNames:string[] = []
            if(obj.params && obj.params.length > 0){
                paramNames = obj.params.map((p:any) => p.name);
            }
            return new DefinedFunction(obj.id.name,obj.type,paramNames);
        }
        default: { 
           console.log("Missing Expression for: ");
           console.log(obj.type)
           return null as any;
        } 
     }
}

function memberExpressionHelper(obj:any):string[]{
    let objStr:string[] = [];
    console.log(obj)
    console.log(obj.property)
    if(obj.object) {
        objStr = memberExpressionHelper(obj.object);
    }
    if(obj.property) {
        objStr.push(obj.property.name);
    } else if(obj.name) {
        objStr.push(obj.name);
    }
    return objStr;
}