export class PayloadValidationError extends Error {
  constructor(message: string, public errors: Array<string>) {
    super(message);
    Object.setPrototypeOf(this, PayloadValidationError.prototype);
  }
}
