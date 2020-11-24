import { IController } from './IController';
import { DependencyType } from '../Constant/DependencyType';
import { Container } from 'inversify';

export const AuthenticatedControllers: (
  container: Container
) => Array<IController> = (container: Container) => [
  container.get(DependencyType.Controller.Admin),
  container.get(DependencyType.Controller.Media),
  container.get(DependencyType.Controller.Library),
  container.get(DependencyType.Controller.MediaState),
  container.get(DependencyType.Controller.Server)
];

export const UnauthenticatedControllers = (
  container: Container
): Array<IController> => [
  container.get(DependencyType.Controller.Auth),
  container.get(DependencyType.Controller.Stream),
  container.get(DependencyType.Controller.User)
];
