import { HttpStatus } from '../Constant/HttpStatus';
import { HttpError } from './HttpError';

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(HttpStatus.Unauthorized, message);
  }
}
