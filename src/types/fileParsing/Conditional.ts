import { CalledFunction } from "./CalledFunction";
import { Variable } from "./Variable";

export class Conditional {
    vars?: Variable[];
    functions?: CalledFunction[];
    comparisonOperators?: ComparisionOperator[];
    logicalOperator?: LogicalOperator[];
    constructor(){}
}

export enum ComparisionOperator {
    LT = 0,
    LTE,
    GT,
    GTE,
    EQ,
    NEQ,
    IN
}

export enum LogicalOperator {
    AND = 0,
    OR,
    BOOL
}