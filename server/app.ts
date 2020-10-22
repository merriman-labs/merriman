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

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use(cors());
app.use(busboy());

export default async (configPath: string) => {
  const config = ConfigUtil.readConfig(configPath);
  AppContext.set(AppContext.WellKnown.Config, config);
  const { thumbLocation, port } = config;

  const container = await setupIoc(config);

  app.use('/api', getApiRouter(container));

  app.use(express.static(thumbLocation, { redirect: false }));
  const buildPath = path.join(__dirname, '../build');
  app.use(express.static(buildPath, { redirect: false }));

  app.get('/*', (req, res, next) =>
    res.sendFile(path.join(__dirname, '../build/index.html'))
  );

  app.listen(port, function() {
    printHeader();
    console.log(`Listening on port ${port}!`);
  });
};
