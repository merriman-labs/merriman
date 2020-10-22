import { IController } from './IController';
import { AdminController } from './AdminController';
import { DependencyType } from '../Constant/DependencyType';
import { Container } from 'inversify';

export const Controllers: (container: Container) => Array<IController> = (
  container: Container
) => [
  new AdminController(),
  container.get(DependencyType.Controller.Media),
  container.get(DependencyType.Controller.Library)
];
