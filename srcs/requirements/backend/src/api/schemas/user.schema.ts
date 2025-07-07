export const createUserSchema = {
  body: {
    type: 'object',
    required: ['email', 'username', 'password', 'repeatPassword'],
    properties: {
      email: { type: 'string', format: 'email' },
      username: { type: 'string', minLength: 3 },
      password: { type: 'string', minLength: 6 },
      repeatPassword: { type: 'string', minLength: 6 },
    },
    additionalProperties: false,
  },
};

export const updateUserSchema = {
  body: {
    type: 'object',
    required: ['oldPassword'],
    properties: {
      username: { type: 'string', minLength: 3 },
      email: { type: 'string', format: 'email' },
      oldPassword: { type: 'string', minLength: 6 },
      newPassword: { type: 'string', minLength: 6 },
      repeatPassword: { type: 'string', minLength: 6 },
    },
    additionalProperties: false,
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

export const login2FASchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'code'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      code: { type: 'integer' },
    },
    additionalProperties: false,
  },
};
