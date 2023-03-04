export interface FileNode {
    name:string,
    type:string
}

export function fileNodeTypeGuard(obj:any):boolean {
    return obj === Object(obj) && "name" in obj && "type" in obj;
}