#!/usr/bin/env node

import app from '../app';
import initDir from './init-dir';
import editConfig from './editconfig';
import printOptions from './print-options';
import { argv } from 'process';
import { eject } from './util/eject';

(async function main() {
  switch (argv[2]) {
    case 'initdir':
      await initDir();
      eject();
      break;
    case 'run':
      app();
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
