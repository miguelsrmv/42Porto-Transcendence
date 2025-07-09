const LEN_EMAIL = 254;
const LEN_PASSWORD = 72;
export const LEN_USERNAME = 32;

export const createUserSchema = {
  body: {
    type: 'object',
    required: ['email', 'username', 'password', 'repeatPassword'],
    properties: {
      email: { type: 'string', format: 'email', maxLength: LEN_EMAIL },
      username: { type: 'string', minLength: 3, maxLength: LEN_USERNAME },
      password: { type: 'string', minLength: 6, maxLength: LEN_PASSWORD },
      repeatPassword: { type: 'string', minLength: 6, maxLength: LEN_PASSWORD },
    },
    additionalProperties: false,
  },
};

export const updateUserSchema = {
  body: {
    type: 'object',
    required: ['oldPassword'],
    properties: {
      username: { type: 'string', minLength: 3, maxLength: LEN_USERNAME },
      email: { type: 'string', format: 'email', maxLength: LEN_EMAIL },
      oldPassword: { type: 'string', minLength: 6, maxLength: LEN_PASSWORD },
      newPassword: { type: 'string', minLength: 6, maxLength: LEN_PASSWORD },
      repeatPassword: { type: 'string', minLength: 6, maxLength: LEN_PASSWORD },
    },
    additionalProperties: false,
  },
};

export const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', maxLength: LEN_EMAIL },
      password: { type: 'string', minLength: 6, maxLength: LEN_PASSWORD },
    },
    additionalProperties: false,
  },
};

export const login2FASchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'code'],
    properties: {
      email: { type: 'string', format: 'email', maxLength: LEN_EMAIL },
      password: { type: 'string', minLength: 6, maxLength: LEN_PASSWORD },
      code: { type: 'integer' },
    },
    additionalProperties: false,
  },
};
