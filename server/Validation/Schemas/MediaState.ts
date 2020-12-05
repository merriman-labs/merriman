import { ObjectSchema } from '@johnny.reina/ajv-types';

export const MediaStateSchema: Record<string, ObjectSchema> = {
  setWatchTime: {
    type: 'object',
    required: ['userId', 'mediaId', 'time'],
    properties: {
      userId: {
        type: 'string',
        pattern: '[0-9a-f]{24}'
      },
      mediaId: {
        type: 'string',
        pattern: '[0-9a-f]{24}'
      },
      time: {
        type: 'number',
        minimum: 0
      }
    }
  }
};
