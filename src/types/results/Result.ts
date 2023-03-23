import { FileNode } from "../fileParsing/FileNode";
export class Result {
    target:FileNode;
    vulnerability:string;
    constructor(target:FileNode, vulnerability:string) {
        this.target = target;
        this.vulnerability = vulnerability;
    }
}