import * as conf from './config/defaultConfig.json';

export function recurseObject<T>(obj: any, returnCriteria:(checkObj:any) => Boolean, returnFunc:(funcObj:any) => T, returnArr:T[], maxRecursions: number):T[] {
    if (maxRecursions > conf.recursionMaximum){
        throw new Error("Recursion has reached maximum depth.");
    }

    if(obj && returnCriteria(obj)) {
        returnArr.push(returnFunc(obj));
    }

    // Base case, primitive types are ignored
    if(obj === Object(obj)) {
        //console.log(obj)
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

