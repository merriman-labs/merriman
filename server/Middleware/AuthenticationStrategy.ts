import { Container } from 'inversify';
import { Strategy as LocalStrategy } from 'passport-local';
import { DependencyType } from '../Constant/DependencyType';
import { AuthManager } from '../Managers/AuthManager';

export default (container: Container) =>
  new LocalStrategy(async function authentication(username, password, done) {
    try {
      const auth = container.get<AuthManager>(DependencyType.Managers.Auth);
      const user = await auth.login(username, password);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });
