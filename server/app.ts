import 'reflect-metadata';
import * as express from 'express';
import * as path from 'path';
import * as busboy from 'connect-busboy';
import * as morgan from 'morgan';
import * as cors from 'cors';
import getApiRouter from './routes/api';
import { printHeader } from './cli/util/print-header';
import './Factories/MongoFactory';
import { AppContext } from './appContext';
import { ConfigUtil } from './Utilities/ConfigUtil';
import { setupIoc } from './IOCConfig';
import * as passport from 'passport';
import { UserInfo } from './models/User/UserInfo';
import { doesNotMatch } from 'assert';
import { DependencyType } from './Constant/DependencyType';
import { UserManager } from './Managers/UserManager';

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use(cors());
app.use(busboy());

export default async (configPath: string) => {
  const config = ConfigUtil.readConfig(configPath);
  AppContext.set(AppContext.WellKnown.Config, config);
  const { thumbLocation, port } = config;

  // Set up dependency-injection container, make the MongoDB connection injectable
  const container = await setupIoc(config);

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

  app.use(passport.initialize());

  // Use the DI container to resolve controllers
  app.use('/api', getApiRouter(container));

  // resolve thumbnails
  app.use(express.static(thumbLocation, { redirect: false }));

  // resolve the React app
  const buildPath = path.join(__dirname, '../build');
  app.use(express.static(buildPath, { redirect: false }));

  // Serve up the React app for routes not resolved by API or resources
  app.get('/*', (req, res, next) =>
    res.sendFile(path.join(__dirname, '../build/index.html'))
  );

  app.listen(port, function() {
    printHeader();
    console.log(`Listening on port ${port}!`);
  });
};
