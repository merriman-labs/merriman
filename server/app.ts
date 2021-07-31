import 'reflect-metadata';
import https from 'https';
import fs from 'fs';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import * as path from 'path';
import busboy from 'connect-busboy';
import morgan from 'morgan';
import cors from 'cors';
import getApiRouter from './routes/api';
import { printHeader } from './cli/util/print-header';
import './Factories/MongoFactory';
import { AppContext } from './appContext';
import { Configuration, ConfigUtil } from './Utilities/ConfigUtil';
import { setupIoc } from './IOCConfig';
import passport from 'passport';
import { UserInfo } from './models/User/UserInfo';
import { DependencyType } from './Constant/DependencyType';
import { UserManager } from './Managers/UserManager';
import { Container } from 'inversify';
import AuthenticationStrategy from './Middleware/AuthenticationStrategy';
import mongoSession from 'connect-mongodb-session';
import Logger from './Middleware/Logger';
import { HttpError } from './Errors/HttpError';
import { PayloadValidationError } from './Errors/PayloadValidationError';

export class Merriman {
  private _app = express();
  private _config: Configuration;
  constructor(configPath: string, allowUnsafeFileAccess: boolean = false) {
    this._config = ConfigUtil.readConfig(configPath);
    this._config.allowUnsafeFileAccess = allowUnsafeFileAccess;
    AppContext.set(AppContext.WellKnown.Config, this._config);
  }

  private _setupMiddleware() {
    morgan.token('user', function (req, res) {
      // @ts-ignore
      return req.user ? `${req.user.username} (${req.user._id})` : '--';
    });
    const logFormat =
      '[:date[iso]] [:method] [:url] [:status] [:response-time[3]ms] [:remote-addr] [:user] [len :res[content-length]]';

    this._app.use(express.json({ limit: '5mb' }));
    this._app.use(morgan(logFormat));
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
    const MongoSessionStore = mongoSession(session);
    const sessionStore = new MongoSessionStore({
      uri: this._config.mongo.connectionString,
      databaseName: this._config.mongo.database,
      collection: 'sessions'
    });
    passport.use(AuthenticationStrategy(container));
    passport.serializeUser(function (user: UserInfo, cb) {
      cb(null, user._id);
    });

    passport.deserializeUser(async function (id: string, cb) {
      const userManager = container.get<UserManager>(
        DependencyType.Managers.User
      );
      const user = await userManager.getById(id);
      if (!user) return cb('NOTFOUND');
      cb(null, user);
    });
    this._app.use(
      session({
        secret: this._config.session.secret,
        cookie: {
          maxAge: 604800000
        },
        store: sessionStore,
        resave: true,
        saveUninitialized: true
      })
    );
    this._app.use(passport.initialize());
    this._app.use(passport.session());
  }

  private _setupHttpsServer() {
    if (!this._config.server.useSsl) return;
    https
      .createServer(
        {
          key: fs.readFileSync(this._config.server.keyPath),
          cert: fs.readFileSync(this._config.server.certPath)
        },
        this._app
      )
      .listen(this._config.port, () => {
        console.log('Using HTTPS');
        console.log(`Listening on port ${this._config.port}`);
      });
  }

  private _setupHttpServer() {
    this._app.listen(this._config.port, () => {
      console.log(`Listening on port ${this._config.port}!`);
    });
  }

  private _setupErrorHandling() {
    this._app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof PayloadValidationError) {
          return res
            .status(400)
            .send({ message: err.message, errors: err.errors });
        }
        if (err instanceof HttpError) {
          return res.status(err.statusCode).send(err.message);
        }
        if (err) {
          return res.status(500).send('SERVER_ERROR');
        }
        next();
      }
    );
  }

  public async start() {
    // Set up dependency-injection container, make the MongoDB connection injectable
    const container = await setupIoc(this._config);
    const logger = Logger(container);
    this._app.use(logger);
    this._setupMiddleware();
    this._setupAuth(container);
    this._setupApi(container);
    this._setupStaticAssets();
    this._setupErrorHandling();
    printHeader();
    if (this._config.server.useSsl) {
      this._setupHttpsServer();
    } else {
      this._setupHttpServer();
    }
  }
}
