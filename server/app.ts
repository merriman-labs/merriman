import * as express from 'express';
import * as path from 'path';
import * as busboy from 'connect-busboy';
import * as morgan from 'morgan';
import * as cors from 'cors';
import apiRouter from './routes/api';
import ServerConfigRepo from './data/ServerConfigRepo';
import { printHeader } from './cli/util';
import './Factories/MongoFactory';
import { MongoFactory } from './Factories/MongoFactory';
import { configure } from './cli/configure';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(busboy());

export default async (config: string) => {
  const serverConfigRepo = new ServerConfigRepo(config);
  const { thumbLocation, isConfigured, port } = await serverConfigRepo.fetch();
  if (!isConfigured) {
    console.error(
      'Server not configured yet! Running first time configuration wizard...'
    );
    await configure();
    console.log('Server is now configured and can be started normally.');
    process.exit(0);
  }
  await MongoFactory.init(serverConfigRepo);
  app.use(express.static(thumbLocation, { redirect: false }));
  const buildPath = path.join(__dirname, '../build');

  app.use(express.static(buildPath, { redirect: false }));

  app.use('/api', apiRouter);

  app.get('/*', (req, res, next) =>
    res.sendFile(path.join(__dirname, '../build/index.html'))
  );

  app.listen(port, function() {
    printHeader();
    console.log(`Listening on port ${port}!`);
  });
};
