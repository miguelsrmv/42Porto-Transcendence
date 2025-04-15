type ErrorMessages = {
    [key: string]: string;
};

export const loginErrorMessages: ErrorMessages = {
    "body/password must NOT have fewer than 6 characters": "Invalid Password",
    'body/email must match format "email"': "Invalid Email",
    "Invalid credentials": "Email and Password do not match",
    "An operation failed because it depends on one or more records that were required but not found. Expected a record, found none.": "User not found"
}
