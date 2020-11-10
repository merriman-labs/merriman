import { Merriman } from './app';

const [, , config] = process.argv;
const app = new Merriman(config);
app.start();
