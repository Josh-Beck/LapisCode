import { FileNode } from "../FileNode";

export class Variable implements FileNode {
    name: string;
    type: string;

    constructor(name: string, type: string){
        this.name = name;
        this.type = type;
    }
}