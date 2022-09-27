import * as crypto from "crypto";

const hash = (password: string) => {
  const hashedPassword = crypto
    .pbkdf2Sync(
      password,
      process.env.PASSWORD_SECRET as crypto.BinaryLike,
      1000,
      64,
      `sha512`
    )
    .toString(`hex`);

  return hashedPassword;
};

export { hash };
