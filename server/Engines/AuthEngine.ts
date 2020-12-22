import { injectable } from 'inversify';
import * as bcrypt from 'bcryptjs';

@injectable()
export class AuthEngine {
  doesPasswordMatch(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
