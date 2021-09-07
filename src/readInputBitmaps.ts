import {InputError, inputErrors} from "./InputError";
import Bitmap from "./Bitmap";

type ReadInputLine = () => Promise<string>

async function readInputBitmaps(readInputLine: ReadInputLine): Promise<InputError | Array<Bitmap>> {
    const nrCases = await readNrCases(readInputLine);
    if (nrCases instanceof InputError) {
        return nrCases;
    }

    let idxCase = 0;
    let bitmaps: Array<Bitmap> = [];
    while (idxCase < nrCases) {
        const nrLinCol = await readNrLinesCols(readInputLine);
        if (nrLinCol instanceof InputError) {
            return nrLinCol;
        }
        const [nrLin, nrCol] = nrLinCol;

        const bitmapLines = await readBitmapLines(readInputLine, nrLin, nrCol);
        if (bitmapLines instanceof InputError) {
            return bitmapLines;
        }
        if (!bitmapHas1(bitmapLines)) {
            const bitmapInputLines = bitmapLines.map(line => line.join(""));
            return inputErrors.invalidBitmapWithout1(bitmapInputLines);
        }
        bitmaps.push(new Bitmap(bitmapLines, nrLin, nrCol));

        if (nrCases > 1 && idxCase < nrCases - 1) {
            const testCaseSep = await readInputLine();
            if (testCaseSep !== '') {
                return inputErrors.invalidTestCaseSep(testCaseSep);
            }
        }

        idxCase++;
    }

    return bitmaps;
}

function bitmapHas1(bitmapLines: Array<Array<0 | 1>>): boolean {
    return bitmapLines.flat().includes(1);
}

async function readNrCases(readInputLine: ReadInputLine): Promise<InputError | number> {
    const nrCasesStr = await readInputLine();
    const nrCases = Number(nrCasesStr);
    if (isNaN(nrCases) || nrCases < 1 || nrCases > 1000) {
        return inputErrors.invalidNrTestCases(nrCasesStr);
    } else {
        return nrCases;
    }
}

async function readNrLinesCols(readInputLine: ReadInputLine): Promise<InputError | [number, number]> {
    const nrLinColStr = await readInputLine();
    const [nrLinStr, nrColStr] = nrLinColStr.split(" ");
    const nrLin = Number(nrLinStr);
    const nrCol = Number(nrColStr);
    if (isNaN(nrLin) || isNaN(nrCol) || nrLin < 1 || nrLin > 182 || nrCol < 1 || nrCol > 182) {
        return inputErrors.invalidNrLinesCols(nrLinColStr);
    } else {
        return [nrLin, nrCol];
    }
}

async function readBitmapLines(readInputLine: ReadInputLine, nrLin: number, nrCol: number): Promise<InputError | Array<Array<0 | 1>>> {
    let idxLin = 0;
    let bitmapLines: Array<Array<0 | 1>> = [];
    while (idxLin < nrLin) {
        const bitmapLine = await readBitmapLine(readInputLine, nrCol);
        if (bitmapLine instanceof InputError) {
            return bitmapLine;
        }
        bitmapLines.push(bitmapLine);

        idxLin++;
    }
    return bitmapLines;
}

async function readBitmapLine(readInputLine: ReadInputLine, nrCol: number): Promise<InputError | Array<0 | 1>> {
    const line = await readInputLine();
    const is01 = /^[01]+$/.test(line);
    if (!is01) {
        return inputErrors.invalidLineOnly01(line);
    }
    if (line.length !== nrCol) {
        return inputErrors.invalidLineNrCol(line, nrCol);
    }

    return line
        .split("")
        .map(bit => bit === '1' ? 1 : 0)
}

export default readInputBitmaps;
