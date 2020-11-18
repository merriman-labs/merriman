import { ObjectSchema } from '@johnny.reina/ajv-types';

export const MediaSchema: Record<string, ObjectSchema> = {
  upload: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: {
        type: 'string',
        pattern: '[0-9a-f]{24}'
      }
    }
  },
  registerLocal: {
    type: 'object',
    required: ['userId', 'tags', 'libraries', 'filename', 'path'],
    properties: {
      userId: {
        type: 'string',
        pattern: '[0-9a-f]{24}'
      },
      tags: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      libraries: {
        type: 'array',
        items: {
          type: 'object',
          required: ['_id'],
          properties: {
            _id: {
              type: 'string',
              pattern: '[0-9a-f]{24}'
            }
          }
        }
      },
      filename: {
        type: 'string'
      },
      path: {
        type: 'string'
      }
    }
  }
};
