import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export const ask = (q: string) =>
  new Promise<string>(function(res) {
    rl.question(q + '\n', res);
  });
