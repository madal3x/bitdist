import { expect } from 'chai';
import readInputBitmaps from "../src/readInputBitmaps";
import {InputError, inputErrors} from "../src/InputError";
import Bitmap from "../src/Bitmap";

describe('readBitmapsStdin', function() {
  it('returns error if the nr of cases is not a number', async function() {
    const input = "a"
    await assertInvalidNrTestCases(input);
  });

  it('returns error if the nr of cases is greater than 1000', async function() {
    const input = "1001"
    await assertInvalidNrTestCases(input);
  });

  it('returns error if the nr of cases is smaller than 1', async function() {
    const input = "0"
    await assertInvalidNrTestCases(input);
  });

  it('returns error if the nr lines is not a number', async function() {
    const input = "a 1";
    await assertInvalidNrLinesCols(input);
  });

  it('returns error if the nr lines is less than 1', async function() {
    const input = "a 0";
    await assertInvalidNrLinesCols(input);
  });

  it('returns error if the nr lines is greater than 182', async function() {
    const input = "a 183";
    await assertInvalidNrLinesCols(input);
  });

  it('returns error if the nr cols is not a number', async function() {
    const input = "1 a";
    await assertInvalidNrLinesCols(input);
  });

  it('returns error if the nr cols is less than 1', async function() {
    const input = "0 a";
    await assertInvalidNrLinesCols(input);
  });

  it('returns error if the nr cols is greater than 182', async function() {
    const input = "183 a";
    await assertInvalidNrLinesCols(input);
  });

  it('returns error if a bitmap line has more columns than specified in the input', async function() {
    const nrCol = 3
    const input = "0000";
    assertInvalidBitmapLine(input, nrCol);
  });

  it('returns error if a bitmap line has less columns than specified in the input', async function() {
    const nrCol = 3
    const input = "00";
    assertInvalidBitmapLine(input, nrCol);
  });

  it('returns error if a bitmap line has different chars than 0 or 1', async function() {
    const nrCol = 3
    const input = "0a";
    assertInvalidBitmapLine(input, nrCol);
  });

  it('returns error if the bitmap does not contain at least a 1', async function() {
    const inputLinesBitmap = [
      "000",
      "000"
    ];
    const inputLines = ["1", "2 3", ...inputLinesBitmap];

    const result = await readInputBitmaps(readLinesMock(inputLines));
    const expectedErr = inputErrors.invalidBitmapWithout1(inputLinesBitmap);

    assertInputError(result, inputLinesBitmap.join("\n"), expectedErr);
  });

  it('returns two bitmaps when all preconditions have been satisfied', async function() {
    const nrCases = 2;
    const bitmap1NrLin = 2;
    const bitmap1NrCol = 3;
    const inputBitmap1: Array<Array<0 | 1>> = [
      [1, 0, 1],
      [0, 0, 1]
    ];
    const inputLinesBitmap1 = inputBitmap1.map(l => l.join(""));
    const bitmap2NrLin = 3;
    const bitmap2NrCol = 2;
    const inputBitmap2: Array<Array<0 | 1>> = [
      [0, 0],
      [0, 1],
      [0, 0]
    ]
    const inputLinesBitmap2 = inputBitmap2.map(l => l.join(""));
    const inputLines = [`${nrCases}`,
      `${bitmap1NrLin} ${bitmap1NrCol}`,
      ...inputLinesBitmap1,
      "",
      `${bitmap2NrLin} ${bitmap2NrCol}`,
      ...inputLinesBitmap2
    ];

    const result = await readInputBitmaps(readLinesMock(inputLines));

    expect(result).to.be.an('array');
    const bitmap1 = (Array.isArray(result) && result[0]) as Bitmap;
    const bitmap2 = (Array.isArray(result) && result[1]) as Bitmap;
    assertBitmap(bitmap1, inputBitmap1);
    assertBitmap(bitmap2, inputBitmap2);
  });
});

async function assertInvalidNrTestCases(input: string) {
  const inputLines = [input];

  const result = await readInputBitmaps(readLinesMock(inputLines));
  const expectedErr = inputErrors.invalidNrTestCases(input)

  assertInputError(result, input, expectedErr);
}

async function assertInvalidNrLinesCols(input: string) {
  const inputLines = ["1", input];

  const result = await readInputBitmaps(readLinesMock(inputLines));
  const expectedErr = inputErrors.invalidNrLinesCols(inputLines[1]);

  assertInputError(result, input, expectedErr);
}

async function assertInvalidBitmapLine(input: string, nrCol: number) {
  const inputLines = ["1", `1 ${nrCol}`, input];

  const result = await readInputBitmaps(readLinesMock(inputLines));
  const expectedErr = inputErrors.invalidLineNrCol(input, nrCol)

  assertInputError(result, input, expectedErr);
}

function assertBitmap(bitmap: Bitmap, expectedMap: Array<Array<0 | 1>>) {
  expect(bitmap.nrLin).not.equal(0);
  expect(bitmap.nrCol).not.equal(0);
  expect(bitmap.nrLin).equal(expectedMap.length);
  expect(bitmap.nrCol).equal(expectedMap[0].length);

  for (let l = 0; l < bitmap.nrLin; l++) {
    for (let c = 0; c < bitmap.nrCol; c++) {
      expect(bitmap.elementAt(l, c)).equal(expectedMap[l][c])
    }
  }
}

function assertInputError(result: InputError | Array<Bitmap>, input: string, expectedErr: InputError) {
  expect(result).to.be.an.instanceof(InputError);
  expect((result as InputError).msg).equal(expectedErr.msg);
  expect((result as InputError).input).equal(input);
}

function readLinesMock(lines: string[]): () => Promise<string> {
  let nrLine = 0;
  return function readLine(): Promise<string> {
    nrLine++;
    return Promise.resolve(lines[nrLine-1]);
  }
}
