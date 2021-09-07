import * as readline from 'readline';
import readInputBitmaps from "./readInputBitmaps";
import readStdinLine from "./readStdinLine";
import {InputError} from "./InputError";

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const readInputLine = async () => readStdinLine(rl)
    console.log("Input:");
    const bitmaps = await readInputBitmaps(readInputLine)
    rl.close();
    if (bitmaps instanceof InputError) {
        console.log(`InputError msg: ${bitmaps.msg}\nfor input: ${bitmaps.input}`)
    } else {
        console.log("\nOutput:\n");
        const distancesOutput = bitmaps
            .map(bitmap => bitmap.nearestWhiteDistances())
            .map(distancesMat => distancesMat.map(distances => distances.join(" ")).join("\n"))
            .join("\n\n")

        console.log(distancesOutput);
    }
}


main();
