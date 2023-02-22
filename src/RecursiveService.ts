import * as conf from './config/defaultConfig.json';

export function recurseObject<T>(obj: any, returnCriteria:(checkObj:any) => Boolean, returnFunc:(funcObj:any) => T, returnArr:T[], maxRecursions: number):T[] {

    console.log("")
    console.log(obj)
    console.log("")
    if (maxRecursions > conf.recursionMaximum){
        throw new Error("Recursion has reached maximum depth.");
    }

    if(obj && returnCriteria(obj)) {
        returnArr.push(returnFunc(obj));
    }

    // Base case, JSON object lowest result is of type string.
    if(typeof (obj) !== 'string'){
        for(var i in obj) {
            //Either object or array index
            if(typeof (i) === 'object') {
                recurseObject(i, returnCriteria, returnFunc, returnArr, maxRecursions+1);
            } else {
                recurseObject(obj[i], returnCriteria, returnFunc, returnArr, maxRecursions+1);
            }
        }
    }
    return returnArr;
}

