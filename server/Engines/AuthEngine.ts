import { injectable } from 'inversify';
import * as bcrypt from 'bcrypt';

@injectable()
export class AuthEngine {
  doesPasswordMatch(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
