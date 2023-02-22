import { FileNode } from "./FileNode";

export class DefinedFunction implements FileNode{
    parameterNames: string[];
    name: string;
    type: string;
    
    constructor(name: string, type: string, params:string[]){
        this.name = name;
        this.type = type;
        this.parameterNames = params;
    }
}