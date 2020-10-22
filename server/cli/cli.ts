import { program, Command } from 'commander';
import app from '../app';
program.name('merriman');

program
  .command('run <config>')
  .description('start server using config')
  .action((config: string) => {
    app(config);
  });

program
  .command('initdir <config> <directory>')
  .description('initialize a directory using the config provided')
  .action((config: string, dir: string) => {
    console.log('run', config, dir);
  });

program.parse(process.argv);

export default 0;
