import ajv from 'ajv';
import { Schema } from './Schemas/index';

class ValidationEngine {
  private _ajv: ajv.Ajv;
  constructor() {
    this._ajv = new ajv();
    this._registerSchemas();
  }

  private _registerSchemas() {
    const keys = Object.keys(Schema);
    keys.forEach((key) => {
      const methods = Object.keys(Schema[key]);
      methods.forEach((method) => {
        this._ajv.addSchema(Schema[key][method], `${key}.${method}`);
      });
    });
  }

  public validate<T>(item: any, schema: string): T {
    const result = this._ajv.validate(schema, item);
    if (result === true) {
      return item as T;
    } else {
      // @ts-ignore
      throw new Error(
        this._ajv.errors
          ? this._ajv.errors.map((error) => `body ${error.message}`).join('\n')
          : 'VALIDATION_ERROR'
      );
    }
  }
}

export default new ValidationEngine();
