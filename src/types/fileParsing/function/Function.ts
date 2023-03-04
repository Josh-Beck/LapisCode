import { FileNode } from "../FileNode";

export class Function implements FileNode{
    name: string;
    type: string;
    parameterNames?:Array<Array<FileNode>>;
    super?: Array<FileNode>;

    constructor(name: string, type: string, params?:Array<Array<FileNode>>){
        this.name = name;
        this.type = type;
        console.log("PARAMS")
        console.log(params)
        this.parameterNames = params;
    }
    
}