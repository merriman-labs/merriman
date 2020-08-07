#!/usr/bin/env node

import app from '../app';
import initDir from './init-dir';
import editConfig from './editconfig';
import printOptions from './print-options';
import { argv } from 'process';
import { eject } from './util/eject';
import { configure } from './configure';

(async function main() {
  switch (argv[2]) {
    case 'config':
      await configure();
      eject();
      break;
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
