import { Variable } from "./Variable";
import { DefinedFunction } from "./DefinedFunction";
import { CalledFunction } from "./CalledFunction";
import { Conditional } from "./Conditional";

export interface ParsedFile {
    variableList: Map<string,Variable>,
    defFunctionList: DefinedFunction[],
    calledFunctionList: CalledFunction[],
    conditional: Conditional[]
}