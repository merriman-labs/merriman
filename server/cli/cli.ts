#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import uuid from 'uuid/v4';
import { program } from 'commander';
import { Merriman } from '../app';
import { Configuration } from '../Utilities/ConfigUtil';
program.name('merriman');

program
  .command('run <config>')
  .option(
    '-a, --allow-unsafe-access',
    'Allow the server to access and traverse the file system for registering media',
    false
  )
  .description('start server using config')
  .action(function (config: string, options: { allowUnsafeAccess: boolean }) {
    const app = new Merriman(config, options.allowUnsafeAccess);
    return app.start();
  });

program
  .command('init <name>')
  .description('create a new configuration file using the specified file name')
  .action(function (name: string) {
    const config = new Configuration();
    config.allowUnsafeFileAccess = false;
    config.mediaLocation = path.resolve(os.homedir(), 'media');
    config.mongo = {
      connectionString: 'mongo://localhost:27017',
      database: 'merriman'
    };
    config.name = 'merriman';
    config.port = 80;
    config.server = { useSsl: false };
    config.session = { secret: uuid() };
    config.thumbLocation = path.resolve(os.homedir(), 'thumbnails');
    fs.writeFileSync(`${name}.config.json`, config.toJson(), {
      encoding: 'utf8'
    });
  });

program.parse(process.argv);

export default 0;
