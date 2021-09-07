export default class Bitmap {
    private readonly map: Array<Array<0 | 1>>
    readonly nrLin: number
    readonly nrCol: number

    constructor(map: Array<Array<0 | 1>>, nrLin: number, nrCol: number) {
        this.map = map;
        this.nrLin = nrLin;
        this.nrCol = nrCol;
    }

    nearestWhiteDistances(): Array<Array<number>> {
        let output: Array<Array<number>> = [...Array(this.nrLin).keys()].map(_ => new Array(this.nrCol));
        for (let lin = 0; lin < this.nrLin; lin++) {
            for (let col = 0; col < this.nrCol; col++) {
                const maxDist = this.nrLin + this.nrCol - 2;
                let dist = 0;
                let found: boolean = false;
                while (dist <= maxDist && !found) {
                    const linCols = this.linColsWithinDistance(lin, col, dist);
                    let nextLinCol;
                    while (!(nextLinCol = linCols.next()).done && !found) {
                        const [l, c] = nextLinCol.value;
                        if (this.map[l][c] === 1) {
                            output[lin][col] = dist;
                            found = true;
                        }
                    }
                    dist++;
                }
            }
        }

        return output;
    }

    elementAt(lin: number, col: number): 0 | 1 | undefined {
        if (lin < this.nrLin && col < this.nrCol) {
            return this.map[lin][col];
        } else {
            return undefined;
        }
    }

    private *linColsWithinDistance(lin: number, col: number, dist: number): IterableIterator<[number, number]> {
        const linMin = Math.max(0, lin - dist);
        const colMin = Math.max(0, col - dist);
        const linMax = Math.min(this.nrLin - 1, lin + dist);
        const colMax = Math.min(this.nrCol - 1, col + dist);

        for (let li = linMin; li <= linMax; li++) {
            for (let ci = colMin; ci <= colMax; ci++) {
                if (distance(lin, col, li, ci) === dist) {
                    yield [li, ci];
                }
            }
        }
    }
}

function distance(l1: number, c1: number, l2: number, c2: number): number {
    return Math.abs(l1 - l2) + Math.abs(c1 - c2);
}
