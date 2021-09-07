import * as readline from 'readline';

async function readStdinLine(readline: readline.Interface): Promise<string> {
    return new Promise(resolve => {
        readline.question("", userInput => {
            resolve(userInput);
        });
    });
}

export default readStdinLine;
