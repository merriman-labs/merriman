import * as express from 'express';
import * as path from 'path';
import * as busboy from 'connect-busboy';
import * as morgan from 'morgan';
import * as cors from 'cors';
import apiRouter from './routes/api';
import ServerConfigRepo from './data/ServerConfigRepo';
import { printHeader } from './cli/util';

const app = express();
const serverConfigRepo = new ServerConfigRepo();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(busboy());

serverConfigRepo.fetch().then(({ thumbLocation }) => {
  app.use(express.static(thumbLocation, { redirect: false }));
  const buildPath = path.join(__dirname, '../build');

  app.use(express.static(buildPath, { redirect: false }));

  app.use('/api', apiRouter);

  app.get('/*', (req, res, next) =>
    res.sendFile(path.join(__dirname, '../build/index.html'))
  );
});

export default () =>
  app.listen(80, function() {
    printHeader();
    console.log('Listening on port 80!');
  });
