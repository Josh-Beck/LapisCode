import console from "console";
import { createDir, writeFile } from "../services/FileService";
import { DefinedFunction } from "../types/fileParsing/function/DefinedFunction";
import { Function } from "../types/fileParsing/function/Function";
import { Result } from "../types/results/Result";
var fs = require('fs');

export function handleResults(resultList:Result[]):boolean {
    printResults(resultList);
    resultsToFile(resultList);
    return true;
}

export function resultsToFile(resultList:Result[]):void {
    createDir("./LapisResults");
    writeFile("./LapisResults/vulnerabilityInformation.json", resultList);
}

export function printResults(resultList:Result[]):void {
    console.log();
    console.log("----------------------------------------");
    for(let i:number = 0; i < resultList.length; i++) {
        console.log("Vulnerability: " + resultList[i].vulnerability)
        console.log("Object name: " + resultList[i].target.name)
        console.log("Object type: " + resultList[i].target.type);
        if(resultList[i].target instanceof Function || resultList[i].target instanceof DefinedFunction) {
            console.log("One or more of these function parameters could be vulnerable: ");
            (resultList[i].target as Function).parameterNames?.forEach((el) => {
                console.log(el)
            });
        }
        console.log();
        console.log();
    }
    console.log("----------------------------------------");
}