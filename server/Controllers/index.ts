import { IController } from './IController';
import { MediaController } from './MediaController';
import { LibraryController } from './LibraryController';
import { AdminController } from './AdminController';

export const Controllers: Array<IController> = [
  new AdminController(),
  new MediaController(),
  new LibraryController()
];
