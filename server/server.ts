import { Merriman } from './app';

const [, , config] = process.argv;
const allowUnsafe =
  process.argv.includes('-a') || process.argv.includes('--allow-unsafe');
const app = new Merriman(config, allowUnsafe);
export default app.start();
