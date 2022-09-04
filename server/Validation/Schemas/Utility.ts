import { ObjectSchema, StringSchema } from '@johnny.reina/ajv-types';

export const UtilitySchema = {
  ObjectId: <StringSchema>{
    type: 'string',
    pattern: '[0-9a-f]{24}'
  },
  Configuration: <ObjectSchema>{
    type: 'object',
    required: [
      'mediaLocation',
      'thumbLocation',
      'server',
      'mongo',
      'session',
      'name',
      'port'
    ],
    properties: {
      mediaLocation: {
        type: 'string'
      },
      thumbLocation: {
        type: 'string'
      },
      server: {
        type: 'object',
        anyOf: [
          {
            type: 'object',
            required: ['useSsl'],
            properties: {
              useSsl: {
                type: 'boolean',
                enum: [false]
              }
            }
          },
          {
            type: 'object',
            required: ['useSsl', 'certPath', 'keyPath'],
            properties: {
              useSsl: {
                type: 'boolean',
                enum: [true]
              },
              certPath: {
                type: 'string'
              },
              keyPath: {
                type: 'string'
              }
            }
          }
        ]
      },
      mongo: {
        type: 'object',
        required: ['connectionString', 'database'],
        properties: {
          connectionString: {
            type: 'string'
          },
          database: {
            type: 'string'
          }
        }
      },
      name: {
        type: 'string'
      },
      port: {
        type: 'integer'
      },
      pathRewrites: {
        type: 'object'
      }
    }
  }
};
