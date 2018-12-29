import { execSync } from 'child_process';
import { join } from 'path';

export default () => {
  const serverConfig = join(__dirname, '../../data/db/server.json');
  execSync(serverConfig);
};
