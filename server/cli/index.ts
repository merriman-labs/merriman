#!/usr/bin/env node

import app from '../app';
import initDir from './init-dir';
import editConfig from './editconfig';
import printOptions from './print-options';
import { argv } from 'process';
import { eject } from './util/eject';
import { configure } from './configure';

(async function main() {
  let conf;
  switch (argv[2]) {
    case 'config':
      conf = argv[3];
      if (!conf) throw new Error('Must provide config name');
      await configure(conf);
      eject();
      break;
    case 'initdir':
      conf = argv[3];
      if (!conf) throw new Error('Must provide config name');
      await initDir(conf);
      eject();
      break;
    case 'run':
      conf = argv[3];
      if (!conf) throw new Error('Must provide config name');
      app(conf);
      break;
    case 'editconfig':
      editConfig();
      eject();
      break;
    default:
      printOptions();
      eject();
      break;
  }
})();
