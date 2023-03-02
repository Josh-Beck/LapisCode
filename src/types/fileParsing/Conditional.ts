import { FileNode } from "./FileNode";

export class Conditional implements FileNode {
    name:string;
    type:string;
    //vars?: string[];
    //functions?: string[];
    args:Array<Array<FileNode>> = [];
    comparisonOperators: ComparisionOperator[] = [];
    logicalOperators: LogicalOperator[] = [];
    constructor(name:string, type:string){
        this.name = name;
        this.type = type;
    }
}

export enum ComparisionOperator {
    LT = '<',
    LTE = '<=',
    GT = '>',
    GTE = '>=',
    EQ2 = '==',
    EQ = '===',
    NEQ2 = '!=',
    NEQ = '!=='
}

export enum LogicalOperator {
    AND = "&&",
    OR = "||",
    NOT = "!",
    BOOL = "BOOL"
}