import crypto from "crypto";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .pbkdf2Sync(password, salt, 100, 64, "sha512")
    .toString("hex");

  return { hash, salt };
}

export function verifyPassword({
  candidatePassword,
  hash,
  salt,
}: {
  candidatePassword: string;
  hash: string;
  salt: string;
}) {
  const candidateHash = crypto
    .pbkdf2Sync(candidatePassword, salt, 100, 64, "sha512")
    .toString("hex");

  return candidateHash === hash;
}
