#!/usr/bin/env node

import { program } from 'commander';
import { Merriman } from '../app';
program.name('merriman');

program
  .command('run <config>')
  .option(
    '-a, --allow-unsafe-access',
    'Allow the server to access and traverse the file system for registering media',
    false
  )
  .description('start server using config')
  .action(function(config: string, options: { allowUnsafeAccess: boolean }) {
    const app = new Merriman(config, options.allowUnsafeAccess);
    return app.start();
  });

program.parse(process.argv);

export default 0;
