import Bitmap from "../src/Bitmap";
import { expect } from 'chai';

describe('Bitmap', function() {
    it('returns expected nearest white distances for the assignment example input:\n' +
        '[[0, 0, 0, 1],\n' +
        '[0, 0, 1, 1],\n' +
        '[0, 1, 1, 0]]', async function () {

        const input: Array<Array<0 | 1>> = [
            [0, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 1, 1, 0]
        ]
        const expectedOut = [
            [3, 2, 1, 0],
            [2, 1, 0, 0],
            [1, 0, 0, 1]
        ];
        assertBitmapNearest(input, expectedOut);
    });

    it('returns expected nearest white distances for when there is only one white value:\n' +
        '[[0, 0, 0, 1],\n' +
        '[0, 0, 0, 0],\n' +
        '[0, 0, 0, 0],\n' +
        '[0, 0, 0, 0],\n' +
        '[0, 0, 0, 0]]', async function () {

        const input: Array<Array<0 | 1>> = [
            [0, 0, 0, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
        const expectedOut = [
            [3, 2, 1, 0],
            [4, 3, 2, 1],
            [5, 4, 3, 2],
            [6, 5, 4, 3],
            [7, 6, 5, 4]
        ];
        assertBitmapNearest(input, expectedOut);
    });

    it('returns expected nearest white distances for when there is only one line and one column:\n' +
        '[[1]]', async function () {

        const input: Array<Array<0 | 1>> = [
            [1]
        ]
        const expectedOut = [
            [0]
        ];
        assertBitmapNearest(input, expectedOut);
    });
});


function assertBitmapNearest(input: Array<Array<0 | 1>>, expectedOut: Array<Array<number>>) {
    const bitmap = new Bitmap(
        input,
        input.length,
        input[0].length
    )
    expect(bitmap.nearestWhiteDistances()).eql(expectedOut);
}
