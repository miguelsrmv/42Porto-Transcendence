//TODO: Else unkonwn error
//TODO: Explain why password / username are invalid ??
export const loginErrorMessages = {
    'body/password must NOT have fewer than 6 characters': 'Invalid Password',
    'body/email must match format "email"': 'Invalid Email',
    'Invalid credentials': 'Email and Password do not match',
    'An operation failed because it depends on one or more records that were required but not found. Expected a record, found none.': 'User not found',
};
//TODO: Else unkonwn error
//TODO: Explain why password / username are invalid ??
export const registerErrorMessages = {
    'body/username must NOT have fewer than 3 characters': 'Invalid Username (< 3 characters)',
    'body/email must match format "email"': 'Invalid Email',
    'body/password must NOT have fewer than 6 characters': 'Invalid Password',
    'Passwords do not match': 'Passwords do not match',
    'Unique constraint failed on the fields: (`username`)': 'Username already in use',
    'Unique constraint failed on the fields: (`email`)': 'Email already in use',
};
//# sourceMappingURL=errorMessages.js.map