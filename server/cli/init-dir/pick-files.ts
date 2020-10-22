import { askProceed } from '../util/ask-proceed';
import { ask } from '../util/ask';
import initFiles from './init-files';
import ServerConfigRepo from '../../data/ServerConfigRepo';
import { Configuration } from '../../Utilities/ConfigUtil';

/**
 * Generates a table of file names with indices, highlighting files in the queue.
 * @param files
 * @param queue
 */
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

/**
 * Get the instructions to pick files.
 * @param fileMap
 * @param queue
 */
const pickFilesDirections = (
  fileMap: Map<number, string>,
  queue: Set<number>
) => `

Enter a number from the following and press <enter> to queue it up
Enter the number again to remove it
Enter all to add all
Enter done to finish
${formatFileNames(fileMap, queue)}\n`;

const createFileMap = (files: Array<string>): Map<number, string> => {
  return new Map<number, string>(files.map<[number, string]>((v, i) => [i, v]));
};

export default async (
  files: Array<string>,
  source: string,
  config: Configuration
) => {
  const fileMap = createFileMap(files);
  const queue = new Set<number>();

  let response;

  // Print files until we are done adding new ones.
  while ((response = await ask(pickFilesDirections(fileMap, queue)))) {
    if (response === 'done') {
      break;
    } else if (response === 'all') {
      Array.from(fileMap.keys()).forEach(key => queue.add(key));
      continue;
    } else {
      const responseNum = Number.parseInt(response);
      if (queue.has(responseNum)) queue.delete(responseNum);
      else queue.add(responseNum);
    }
  }

  await askProceed();
  const fileIndices = Array.from(queue.values());

  const filePicks = fileIndices.map(key => fileMap.get(key));
  await initFiles(filePicks, source, config);
};
