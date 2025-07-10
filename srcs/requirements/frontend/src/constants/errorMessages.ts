type ErrorMessages = {
  [key: string]: string;
};

//TODO: Else unknown error
//TODO: Explain why password / username are invalid ??
export const loginErrorMessages: ErrorMessages = {
  'body/password must NOT have fewer than 6 characters': 'Invalid Password',
  'body/email must match format "email"': 'Invalid Email',
  'body/password must NOT have more than 72 characters': 'Password too long (> 72 characters)',
  'body/email must NOT have more than 254 characters': 'Email too long (> 254 characters)',
  'Invalid credentials': 'Email and Password do not match',
  'An operation failed because it depends on one or more records that were required but not found. No record was found for a query.':
    'User not found',
  'User is already logged in on another device or tab.': 'User is already logged in on another device or tab.',
};

//TODO: Else unknown error
//TODO: Explain why password / username are invalid ??
export const registerErrorMessages: ErrorMessages = {
  'body/username must NOT have fewer than 3 characters': 'Invalid Username (< 3 characters)',
  'body/email must match format "email"': 'Invalid Email',
  'body/password must NOT have fewer than 6 characters': 'Invalid Password (< 6 characters)',
  'body/password must NOT have more than 72 characters': 'Password too long (> 72 characters)',
  'body/email must NOT have more than 254 characters': 'Email too long (> 254 characters)',
  'body/username must NOT have more than 32 characters': 'Username too long (> 32 characters)',
  'Passwords do not match': 'Passwords do not match',
  'Unique constraint failed on the fields: (`username`)': 'Username already in use',
  'Unique constraint failed on the fields: (`email`)': 'Email already in use',
  'username cannot have invalid characters': 'Invalid Username',
  'Invalid email format': 'Invalid Email',
  'Password must include an uppercase letter, a lowercase letter, and a number':
    'Password must include an uppercase letter, a lowercase letter, and a number',
};

export const twoFAErrorMessages: ErrorMessages = {};

export function getReadableErrorMessage(message: string): string {
  let finalMessage: string | undefined;

  finalMessage = loginErrorMessages[message];

  if (!finalMessage)
    finalMessage = 'An unexpected error occurred. Please refresh the page and retry later.';

  return finalMessage;
}
