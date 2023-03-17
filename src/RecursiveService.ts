import * as conf from './config/defaultConfig.json';
import { FileNode } from './types/fileParsing/FileNode';
import { CalledFunction } from './types/fileParsing/function/CalledFunction';
import { DefinedFunction } from './types/fileParsing/function/DefinedFunction';
import { Function } from './types/fileParsing/function/Function';

export function recurseObject<T>(obj: any, returnCriteria: (checkObj: any) => Boolean, returnFunc: (funcObj: any) => void, maxRecursions: number): void {

    if (recursionMaximumCheck(maxRecursions)) throw new Error("Recursion has reached maximum depth.");

    if (obj && returnCriteria(obj)) returnFunc(obj);

    // Base case, primitive types are ignored
    if (obj === Object(obj)) {
        //console.log(obj)
        for (var i in obj) {
            //Either object or array index
            if (typeof (i) === 'object') {
                recurseObject(i, returnCriteria, returnFunc, maxRecursions + 1);
            } else {
                recurseObject(obj[i], returnCriteria, returnFunc, maxRecursions + 1);
            }
        }
    }
}

export function recurseFileNodeList(nodeList: FileNode[], returnCriteria: (checkObj: FileNode) => Boolean, returnFunc: (funcObj: FileNode) => void, maxRecursions: number) {

    if (recursionMaximumCheck(maxRecursions)) throw new Error("Recursion has reached maximum depth.");

    for (let i: number = 0; i < nodeList.length; i++) {
        if (returnCriteria(nodeList[i])) {
            returnFunc(nodeList[i]);
        }

        if (nodeList[i] instanceof Function || nodeList[i] instanceof DefinedFunction || nodeList[i] instanceof CalledFunction) {

            let node: Function = nodeList[i];   
            if(node.parameterNames) {
                node.parameterNames.map((n) => {
                    recurseFileNodeList(n, returnCriteria, returnFunc, maxRecursions + 1);
                })
            }

            if(node.super) {
                recurseFileNodeList(node.super, returnCriteria, returnFunc, maxRecursions + 1);
            }
        }
    }

}

export function recursionMaximumCheck(num: number): boolean {
    return num > conf.recursionMaximum;
}