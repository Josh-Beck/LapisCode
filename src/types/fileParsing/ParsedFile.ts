import { Variable } from "./variable/Variable";
import { DefinedFunction } from "./function/DefinedFunction";
import { CalledFunction } from "./function/CalledFunction";
import { Conditional } from "./Conditional";

export interface ParsedFile {
    variableList: Map<string,Variable>,
    defFunctionList: DefinedFunction[],
    calledFunctionList: CalledFunction[],
    conditional: Conditional[]
}