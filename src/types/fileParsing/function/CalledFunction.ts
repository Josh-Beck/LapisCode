import { FileNode } from "../FileNode";
import { Function } from "./Function";

export class CalledFunction extends Function{
    constructor(name: string, type: string, params:Array<Array<FileNode>>){
        super(name, type, params)
    }
}