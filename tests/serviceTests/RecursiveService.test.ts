import {describe, expect, test} from '@jest/globals';
import { resourceLimits } from 'worker_threads';
import * as RecursiveService from "../../src/services/RecursiveService";

describe('Recursion Service Tests', () => {
    
    test('Recursion Max check (5)', () => {
        expect(RecursiveService.recursionMaximumCheck(5)).toBe(false);
    });

    test('Recursion Max check (1000)', () => {
        expect(RecursiveService.recursionMaximumCheck(1000)).toBe(true);
    });

    test('Generic Recursion Function', () => {
        let testResults:string[] = [];
        RecursiveService.recurseObject(
            JSON.parse(`{
                "x":"y",
                "z":["a"]
            }`),
            function(node:Object):boolean {
                return typeof node === "string" && node === "y";
            },
            function(node:string):void {
                testResults.push(node);
            },
            0
        )
        
        expect(testResults[0]).toBe("y")
        expect(testResults.length).toBe(1)
    });

    // test('FileNode Recursion Function', () => {
    //     //TODO
    // });
}); 