import { HttpStatus } from '../Constant/HttpStatus';
import { HttpError } from './HttpError';

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(HttpStatus.Conflict, message);
  }
}
