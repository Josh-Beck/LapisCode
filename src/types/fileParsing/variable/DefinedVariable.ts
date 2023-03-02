import { Variable } from "./Variable";
import { FileNode } from "../FileNode";

export class DefinedVariable extends Variable {
    kind: string;
    init: Array<Array<FileNode>> = [];

    constructor(name: string, type: string, kind: string){
        super(name,type);
        this.kind = kind;
    }
}