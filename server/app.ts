import 'reflect-metadata';
import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';
import * as busboy from 'connect-busboy';
import * as morgan from 'morgan';
import * as cors from 'cors';
import getApiRouter from './routes/api';
import { printHeader } from './cli/util/print-header';
import './Factories/MongoFactory';
import { AppContext } from './appContext';
import { Configuration, ConfigUtil } from './Utilities/ConfigUtil';
import { setupIoc } from './IOCConfig';
import * as passport from 'passport';
import { UserInfo } from './models/User/UserInfo';
import { DependencyType } from './Constant/DependencyType';
import { UserManager } from './Managers/UserManager';
import { Container } from 'inversify';
import AuthenticationStrategy from './Middleware/AuthenticationStrategy';

export class Merriman {
  private _app = express();
  private _config: Configuration;
  constructor(configPath: string, allowUnsafeFileAccess: boolean = false) {
    this._config = ConfigUtil.readConfig(configPath);
    this._config.allowUnsafeFileAccess = allowUnsafeFileAccess;
    AppContext.set(AppContext.WellKnown.Config, this._config);
  }

  private _setupMiddleware() {
    this._app.use(function(req, res, next) {
      // @ts-ignore
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header(
        'Access-Control-Allow-Headers',
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
      );
      if ('OPTIONS' == req.method) {
        res.send(200);
      } else {
        next();
      }
    });
    this._app.use(express.json({ limit: '5mb' }));
    this._app.use(morgan('dev'));
    this._app.use(cors());
    this._app.use(busboy());
  }

  private _setupApi(container: Container) {
    // Use the DI container to resolve controllers
    this._app.use('/api', getApiRouter(container));
  }

  private _setupStaticAssets() {
    // resolve thumbnails
    this._app.use(
      express.static(this._config.thumbLocation, { redirect: false })
    );

    // resolve the React app
    const buildPath = path.join(__dirname, '../build');
    this._app.use(express.static(buildPath, { redirect: false }));

    // Serve up the React app for routes not resolved by API or resources
    this._app.get('/*', (req, res, next) =>
      res.sendFile(path.join(__dirname, '../build/index.html'))
    );
  }

  private _setupAuth(container: Container) {
    passport.use(AuthenticationStrategy(container));
    passport.serializeUser(function(user: UserInfo, cb) {
      cb(null, user._id);
    });

    passport.deserializeUser(async function(id: string, cb) {
      const userManager = container.get<UserManager>(
        DependencyType.Managers.User
      );
      const user = await userManager.getById(id);
      if (!user) return cb('NOTFOUND');
      cb(null, user);
    });
    this._app.use(session({ secret: 'bigsecret' }));
    this._app.use(passport.initialize());
    this._app.use(passport.session());
  }

  public async start() {
    // Set up dependency-injection container, make the MongoDB connection injectable
    const container = await setupIoc(this._config);
    this._setupMiddleware();
    this._setupAuth(container);
    this._setupApi(container);
    this._setupStaticAssets();

    this._app.listen(this._config.port, () => {
      printHeader();
      console.log(`Listening on port ${this._config.port}!`);
    });
  }
}
