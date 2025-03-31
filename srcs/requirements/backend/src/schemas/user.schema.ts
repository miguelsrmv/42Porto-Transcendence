import { getByIdSchema } from './global.schema';

export const createUserSchema = {
  body: {
    type: 'object',
    required: ['email', 'username', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      username: { type: 'string', minLength: 3 },
      password: { type: 'string', minLength: 6 },
    },
    additionalProperties: false,
  },
};

export const updateUserSchema = {
  params: getByIdSchema.params,
  body: {
    type: 'object',
    required: ['data'],
    properties: {
      data: {
        type: 'object',
        properties: {
          username: { type: 'string', minLength: 3 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
        additionalProperties: false,
      },
    },
  },
};

export const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
    },
    additionalProperties: false,
  },
};
