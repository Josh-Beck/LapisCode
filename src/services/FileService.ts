var fs = require('fs');

export function writeFile(path:string, obj:any):void {
    fs.writeFile (
        path, 
        JSON.stringify(obj), 
        function(err:any) { if (err) throw err; }
    );
}

export function createDir(path:string):void {
    fs.mkdirSync(path,{recursive:true})
}