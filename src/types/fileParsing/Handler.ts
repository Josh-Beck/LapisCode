import { FileNode } from "./FileNode";

export class Handler implements FileNode {
    name: string;
    type: string;
    kind: string;

    constructor(name: string, type: string, kind: string){
        this.name = name;
        this.type = type;
        this.kind = kind;
    }
}