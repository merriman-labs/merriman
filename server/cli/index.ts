#!/usr/bin/env node
import app from '../app';
import initDir from './init-dir';
import { argv } from 'process';
import { eject } from './util/eject';

(async function main() {
  console.log(argv);
  switch (argv[2]) {
    case 'initdir':
      await initDir();
      break;
    case 'run':
      app();
      break;
    default:
      eject();
      break;
  }
})();
