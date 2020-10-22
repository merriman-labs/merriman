import { IController } from './IController';
import { AdminController } from './AdminController';
import { container } from '../IOCConfig';
import { DependencyType } from '../Constant/DependencyType';

export const Controllers: () => Array<IController> = () => [
  new AdminController(),
  container.get(DependencyType.Controller.Media),
  container.get(DependencyType.Controller.Library)
];
