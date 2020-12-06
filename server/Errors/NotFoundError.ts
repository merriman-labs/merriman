import { HttpStatus } from '../Constant/HttpStatus';
import { HttpError } from './HttpError';

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(HttpStatus.NotFound, message);
  }
}
