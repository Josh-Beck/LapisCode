import { FileNode } from "./FileNode";

export class Literal implements FileNode {
    name: string;
    type: string;
    value?: any;
    regex: boolean = false;

    constructor(name: string, type: string){
        this.name = name;
        this.type = type;
    }
}