import { ObjectSchema } from '@johnny.reina/ajv-types';
export const LibrarySchema: Record<string, ObjectSchema> = {
  create: {
    type: 'object',
    required: ['name', 'userId'],
    additionalProperties: false,
    properties: {
      name: {
        type: 'string',
        minLength: 1
      },
      userId: {
        type: 'string',
        pattern: '[a-f0-9]{24}'
      }
    }
  },
  update: {
    type: 'object',
    required: ['name', '_id', 'visibility'],
    properties: {
      name: {
        type: 'string',
        minLength: 1
      },
      _id: {
        type: 'string',
        pattern: '[a-g0-9]{24}'
      },
      visibility: {
        type: 'number'
      }
    }
  }
};
