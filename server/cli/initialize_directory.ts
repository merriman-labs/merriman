import * as fs from 'fs';
import { add } from 'ramda';
import 'colors';
import * as path from 'path';
import * as readline from 'readline';
import MediaRepo from '../data/MediaRepo';
import ThumbProvider from '../thumb-provider';
import ServerConfigRepo from '../data/ServerConfigRepo';
const serverConfigRepo = new ServerConfigRepo();
class NotImplementedExpection extends Error {}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q: string) =>
  new Promise<string>(function(res, req) {
    rl.question(q, res);
  });

const askProceed = async () => {
  const proceed = await ask('Proceed? [yes/no]\n');

  if (proceed.includes('no') || !proceed.includes('yes')) {
    console.log('Au revoir!');
    process.exit(0);
  }
};

const initFiles = async (files: Array<string>, source: string) => {
  const { thumbLocation } = serverConfigRepo.fetch();
  const mediaRepo = new MediaRepo();

  await ThumbProvider.ensureThumbs(files, source, thumbLocation);
  const newItems = files.map(file => mediaRepo.addExternal(file, source));
  newItems.forEach(item => {
    console.log(`${item.name} added to database with _id ${item._id}`);
  });
};

const formatFileNames = (
  files: Map<number, string>,
  queue: Set<number>
): string => {
  return [...files.entries()]
    .map(([index, file]) => {
      const text = `[${index}] ${file}`;
      return queue.has(index) ? text.green : text;
    })
    .join('\n');
};

const pickFiles = async (files: Array<string>, source: string) => {
  const fileMap = files.reduce(
    (memo, val, i) => memo.set(i, val),
    new Map<number, string>()
  );
  let response;
  const queue = new Set<number>();
  while (
    (response = await ask(
      `Enter a number from the following and press <enter> to queue it up\n
Enter the number again to remove it
Enter done to finish
${formatFileNames(fileMap, queue)}\n`
    )) !== 'done'
  ) {
    const responseNum = Number.parseInt(response);
    if (queue.has(responseNum)) queue.delete(responseNum);
    else queue.add(responseNum);
  }
  await askProceed();

  const filePicks = [...queue.values()].map(key => fileMap[key]);
  await initFiles(filePicks, source);
};

const getFiles = (dir: string): Array<string> => {
  return fs
    .readdirSync(dir)
    .filter(file => !fs.statSync(path.join(dir, file)).isDirectory());
};

async function main() {
  const initDir = await ask('Enter a path to init:\n');

  if (!fs.existsSync(initDir) || !fs.statSync(initDir).isDirectory()) {
    throw `Not a directory: [${initDir}]`;
  }
  const files = getFiles(initDir);
  console.log('Found the following files:');
  console.log(files.join('\r\n'));

  await askProceed();

  const initMethod = await ask(
    'Init all files [all], or select which ones to init? [select]\n'
  );
  if (initMethod.includes('all')) {
    await initFiles(files, initDir);
  } else if (initMethod.includes('select')) {
    throw new NotImplementedExpection(
      'This is all kinds of fucked up right now.'
    );
    await pickFiles(files, initDir);
  } else if (!initMethod.includes('all') && !initMethod.includes('select')) {
    console.log('Au revoir!');
    process.exit(0);
  }

  console.log('Au revoir!');
  process.exit(0);
}

export default (async () => await main())();
