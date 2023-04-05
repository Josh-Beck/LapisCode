var fs = require('fs');

export async function writeFile(path:string, obj:any):Promise<void> {
    await fs.writeFile (
        path, 
        JSON.stringify(obj), 
        function(err:any) { if (err) throw err; }
    );
}

export function createDir(path:string):void {
    fs.mkdirSync(path,{recursive:true})
}