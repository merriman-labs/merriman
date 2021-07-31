import { ObjectSchema } from '@johnny.reina/ajv-types';
import { UtilitySchema } from './Utility';

export const UserSchema: Record<string, ObjectSchema> = {
  create: {
    type: 'object',
    required: ['username', 'password'],
    additionalProperties: false,
    properties: {
      username: {
        type: 'string',
        minLength: 3
      },
      password: {
        type: 'string',
        minLength: 8
      }
    }
  },
  setIsActive: {
    type: 'object',
    required: ['_id', 'isActive'],
    additionalProperties: false,
    properties: {
      _id: UtilitySchema.ObjectId,
      isActive: {
        // @ts-ignore
        type: 'boolean'
      }
    }
  }
};
