import { FileNode } from "../FileNode";
import { Function } from "./Function";

export class DefinedFunction extends Function{
    constructor(name: string, type: string, params:Array<Array<FileNode>>){
        super(name, type, params)
    }
}