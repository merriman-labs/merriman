#!/usr/bin/env node

import { program } from 'commander';
import app from '../app';
program.name('merriman');

program
  .command('run <config>')
  .description('start server using config')
  .action((config: string) => {
    app(config);
  });

program.parse(process.argv);

export default 0;
