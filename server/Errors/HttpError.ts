import { HttpStatus } from '../Constant/HttpStatus';

export class HttpError extends Error {
  constructor(public statusCode: HttpStatus, message: string) {
    super(message);
  }
}
