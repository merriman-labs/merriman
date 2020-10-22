export const LibrarySchema = {
  create: {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
      name: {
        type: 'string',
        minLength: 1
      }
    }
  },
  update: {
    type: 'object',
    required: ['name', '_id', 'items'],
    additionalProperties: false,
    properties: {
      name: {
        type: 'string',
        minLength: 1
      },
      _id: {
        type: 'string',
        pattern: '[a-g0-9]{24}'
      },
      items: {
        type: 'array',
        items: {
          type: 'string',
          pattern: '[a-g0-9]{24}'
        }
      }
    }
  }
};
