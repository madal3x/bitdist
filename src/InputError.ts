class InputError {
    readonly msg: string
    readonly input: string

    constructor(msg: string, input: string) {
        this.msg = msg;
        this.input = input;
    }
}

const inputErrors = {
    invalidNrTestCases: (input: string) =>
        new InputError("Invalid nr of test cases, needs to be a number between 1 and 1000", input),

    invalidNrLinesCols: (input: string) =>
        new InputError("Invalid nr of lines or columns, required two numbers separated by a space between 1 and 182", input),

    invalidLineOnly01: (input: string) =>
        new InputError("Invalid bitmap line, only 0 and 1 expected", input),

    invalidLineNrCol: (input: string, nrCol: number) =>
        new InputError(`Invalid bitmap line length, expected length ${nrCol}`, input),

    invalidTestCaseSep: (input: string) =>
        new InputError("Invalid test case separator", input),

    invalidBitmapWithout1: (bitmapInputLines: Array<string>) =>
        new InputError("No 1 value found in the bitmap, at least one is required", bitmapInputLines.join("\n"))
}

export {inputErrors, InputError};
