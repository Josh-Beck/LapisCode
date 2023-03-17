import { GithubNode } from "./types/GithubNode";
import { GithubContentNode } from "./types/GithubContentNode";
import { githubFetch,getGithubFileFromWebsiteURL } from "./GithubService";
import { decode } from "./utils/Utils";
import { FileNode } from "./types/fileParsing/FileNode";
import { recurseObject } from "./RecursiveService";
import * as acorn from "acorn";
import { DefinedVariable } from "./types/fileParsing/variable/DefinedVariable";
import * as JSConst from "./constants/javascriptConstants"
import { DefinedFunction } from "./types/fileParsing/function/DefinedFunction";
import { CalledFunction } from "./types/fileParsing/function/CalledFunction";
import { Literal } from "./types/fileParsing/Literal";
import { Function } from "./types/fileParsing/function/Function";
import { ComparisionOperator, Conditional, LogicalOperator } from "./types/fileParsing/Conditional";
import { Ident } from "./types/fileParsing/Ident";

//Global variable for use in recursive function
let parsedAndPreppedJSFile:FileNode[] = [];

export async function handleJSFile(url: string):Promise<FileNode[]> {
    let jsFileContents:GithubContentNode = await getJSFile(url);
    //console.log(jsFileContents);

    let parsedJSFile:Object = await parseJSFile(jsFileContents);
    //console.log(parsedJSFile);
    recurseObject<FileNode>(parsedJSFile, returnCriteriaFunction, recursionBaseFunction, 0);
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
    JSConst.FUNC_DECLARATION,
    JSConst.ARROW_FUNCTION,
    JSConst.FUNC_EXPR,
    JSConst.CALL_EXPR,
    JSConst.IF_STATEMENT
]

export function returnCriteriaFunction(obj:any):Boolean {
    //Non-recurse functions
    if(obj.type && obj.type === JSConst.ASSIGNMENT_EXPR) {
        handleAssignmentExpr(obj);
        return false;
    }
    return Object.values(obj).some((val) => typeof val === 'string' ? FILE_NODE_PARSING.includes(val) : false);
}

export function recursionBaseFunction(obj:any) {
    //console.log("")
    //console.log(obj)

    //TODO NewExpression
    //TODO ObjectExpression
    try {
        switch(obj.type) { 
            case JSConst.VAR_DECLARATION: { 
                console.log(obj.declarations[0])
                let defVar:DefinedVariable = new DefinedVariable(obj.declarations[0].id.name,obj.type,obj.kind);

                if(obj.declarations[0].init && obj.declarations[0].init.type === JSConst.MEMBER_EXPR) {
                    defVar.init.push(valuesAndArgsHelper(obj.declarations[0].init));
                } else if(obj.declarations[0].init) {
                    console.log("VARIABLE DECLARATION FUNCITON BASE")
                    //console.log(obj.declarations[0].init)
                    //This no longer works due to the recursion change
                    let initFunc:Function = recursionBaseFunction(obj.declarations[0].init);
                    defVar.init.push([initFunc]);
                }

                // IF DECLARATION EQUALS CALLED FUNCTION - CALLED FUNCTION NAME AND MAP TO FUNCTION
                
                parsedAndPreppedJSFile.push(defVar);
                return defVar;
            } 
            case JSConst.ARROW_FUNCTION:
            case JSConst.FUNC_EXPR:
            case JSConst.FUNC_DECLARATION: { 
                //console.log("INSIDE FUNCTION!")
                let paramNames:Array<Array<FileNode>> = []
                let superNames:Array<FileNode> = [];
                let name:string = "";
                if(obj.params && obj.params.length > 0) {
                    //console.log("PARAMS FUNC");
                    //console.log(obj.params)
                    obj.params.forEach((a:any) => {
                        paramNames.push(valuesAndArgsHelper(a));
                    });
                }
                if(obj.id) {
                    superNames = valuesAndArgsHelper(obj.id.object); 
                    name = valuesAndArgsHelper(obj.id.property)[0].name; 
                }
                let defFunc: DefinedFunction = new DefinedFunction(name,obj.type,paramNames);
                defFunc.super = superNames;
                console.log(defFunc)
                parsedAndPreppedJSFile.push(defFunc);
                return defFunc;
            }
            case JSConst.CALL_EXPR: {
                console.log("CALL ExpRESIONS")
                console.log(obj)
                let callee:FileNode[] = valuesAndArgsHelper(obj.callee)
                let args:Array<Array<FileNode>> = []

                for(let i:number = 0; i < obj.arguments.length; i++) {
                    console.log(obj.arguments[i])
                    if(obj.arguments[i].type === JSConst.MEMBER_EXPR 
                        || obj.arguments[i].type === JSConst.IDENTIFIER 
                        || obj.arguments[i].type === JSConst.LITERAL) {
                        args.push(valuesAndArgsHelper(obj.arguments[i]))
                    } else {
                        let node:FileNode = recursionBaseFunction(obj.arguments[i]);
                        if(node) {
                            args.push([node]);
                        }                    
                    }
                }
                //console.log("CALLEEE")
                //console.log(callee)
                let calledFunc: CalledFunction = new CalledFunction(callee.slice(-1)[0].name,obj.type,args);
                if(callee.length > 1) {
                    calledFunc.super = callee.slice(0,-1);
                }
                
                parsedAndPreppedJSFile.push(calledFunc);
                return calledFunc;
            }
            case JSConst.LITERAL: {
                let lit:Literal = new Literal("Literal",obj.type)
                lit.value = obj.value;
                if(obj.regex) {
                    lit.regex = true;
                }
                return lit;
            }
            case JSConst.IF_STATEMENT: {
                //console.log("IF STATEMENT")
                //console.log(obj.test);
                //console.log(obj.consequent)
                let cond:Conditional = null as any;

                if(obj.test && obj.test.type === JSConst.LOGICAL_EXPR) {
                    cond = new Conditional(JSConst.LOGICAL_EXPR,JSConst.LOGICAL_EXPR);
                    if(obj.test.operator && Object.values(LogicalOperator).includes(obj.test.operator)) {
                        cond.logicalOperators.push(obj.test.operator);
                    } else if(obj.test.operator && Object.values(ComparisionOperator).includes(obj.test.operator)){
                        cond.comparisonOperators.push(obj.test.operator)
                    }
                    cond.args.push(valuesAndArgsHelper(obj.test.left));
                    cond.args.push(valuesAndArgsHelper(obj.test.right));
                } else if(obj.test && obj.test.type === JSConst.UNARY_EXPR) {
                    cond = new Conditional(JSConst.UNARY_EXPR,JSConst.UNARY_EXPR);
                    cond.logicalOperators.push(LogicalOperator.BOOL);
                    if(obj.test.operator && Object.values(LogicalOperator).includes(obj.test.operator)) {
                        cond.logicalOperators.push(obj.test.operator)
                    }
                    if(obj.test.argument) {
                        cond.args.push(valuesAndArgsHelper(obj.test.argument));
                    }
                }
                parsedAndPreppedJSFile.push(cond);
            }
            default: { 
            console.log("Missing Expression for: ");
            console.log(obj.type)
            return null as any;
            } 
        } 
    } catch(e) {
        console.log("Exception occurred while handling object:");
        console.log(e)
        console.log(obj);
        return null as any;
    }
}

function valuesAndArgsHelper(obj:any):FileNode[]{
    let nodeArr:FileNode[] = [];
    if(obj.type === JSConst.MEMBER_EXPR){
        if(obj.object) {
            valuesAndArgsHelper(obj.object).map((a) => nodeArr.push(a));
        }
        if(obj.property){
            valuesAndArgsHelper(obj.property).map((a) => nodeArr.push(a));
        }
    } else if(obj.type === JSConst.IDENTIFIER) {
        let ident:Ident = new Ident(memberExpressionHelper(obj).join('.'),JSConst.IDENTIFIER);
        nodeArr.push(ident)
    } else if (obj.type === JSConst.LITERAL){
        nodeArr.push(recursionBaseFunction(obj))
    }
    return nodeArr;
}

function memberExpressionHelper(obj:any):string[]{

    let objStr:string[] = [];
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

function handleAssignmentExpr(obj:any) {
    let left:any = obj.left;
    let right:any = obj.right;

    switch (right.type) {
        case JSConst.FUNC_EXPR:
        case JSConst.CALL_EXPR:
        case JSConst.ARROW_FUNCTION: {
            let name:string[] = memberExpressionHelper(left);
            right.id = {"name":name.slice(-1)[0],"super":name.slice(0,-1)[0]}
            if(left.property){
                right.id.property = left.property;
            }
            if(left.object){
                right.id.object = left.object;
            }
            console.log("ASSIGNEMENT ");
            console.log(obj);
        }
    }
}