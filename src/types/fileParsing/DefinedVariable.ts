import { FileNode } from "./FileNode";
import { Variable } from "./Variable";

export class DefinedVariable implements FileNode {
    name: string;
    type: string;
    kind: string;
    init?:string[];

    constructor(name: string, type: string, kind: string){
        this.name = name;
        this.type = type;
        this.kind = kind;
    }
}