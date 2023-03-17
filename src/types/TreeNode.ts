export class TreeNode<T> {
    name:string;
    value:T;
    parent?:T;
    children:TreeNode<T>[];
    constructor(name:string, value:T) {
        this.name = name;
        this.value = value;
        this.children = [];
    }
  }
  