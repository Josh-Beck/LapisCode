import { Variable } from "./Variable";

export class ParameterVariable implements Variable {
    name: string;
    constructor(name: string){
        this.name = name;
    }
    
}