import { ObjectSchema, StringSchema } from '@johnny.reina/ajv-types';

export const UtilitySchema = {
  ObjectId: <StringSchema>{
    type: 'string',
    pattern: '[0-9a-f]{24}'
  }
};
