export const UserSchema = {
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
        minLength: 16
      }
    }
  }
};
