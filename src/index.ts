import { mapRepo } from "./repoMapService";


(async (): Promise<void> => {
    x = await mapRepo();
    console.log("Index "+ x);
})();

function main(): number {
    console.log('Hello world!')
    return 0;
    // logic goes here ..
    }