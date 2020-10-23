import { IController } from './IController';
import { DependencyType } from '../Constant/DependencyType';
import { Container } from 'inversify';

export const Controllers: (container: Container) => Array<IController> = (
  container: Container
) => [
  container.get(DependencyType.Controller.Admin),
  container.get(DependencyType.Controller.Media),
  container.get(DependencyType.Controller.Library),
  container.get(DependencyType.Controller.Server)
];
