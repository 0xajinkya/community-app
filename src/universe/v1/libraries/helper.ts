import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserPayloadForJwt } from "../../../interfaces/v1";
import { Env } from "../../../loaders/v1";
import { ParametricError } from "../../../errors";
import { KeyMap } from "../../../types";

/**
 * Encrypts a session payload into a JWT token using the JWT_SECRET.
 * @param {UserPayloadForJwt} payload - The payload to encrypt into the JWT token.
 * @returns {string} - The encrypted JWT token.
 */
export const encryptSession = (payload: UserPayloadForJwt): string => {
  const jwtToken = jwt.sign(payload, Env.variable.NODE_JWT_SECRET);
  return jwtToken;
};

/**
 * Decrypts a JWT token into the original user ID using the JWT_SECRET.
 * @param {string} jwtToken - The JWT token to decrypt.
 * @returns {string} - The decrypted user ID extracted from the JWT token.
 * @throws {ParametricError} - Throws a ParametricError if the JWT token is invalid or expired.
 */
export const decryptSession = (jwtToken: string): string => {
  try {
    const { id } = jwt.verify(
      jwtToken,
      Env.variable.NODE_JWT_SECRET
    ) as JwtPayload;
    return id;
  } catch (error) {
    throw new ParametricError([
      { message: "User not found.", param: "user", code: "RESOURCE_NOT_FOUND" },
    ]);
  }
};

export const renameKeys = <T extends Record<string, any>>(
  obj: T,
  keyMap: KeyMap<T>
): Record<string, any> => {
  const newObj: Record<string, any> = {};

  for (let key in obj) {
    const newKey = keyMap[key as keyof T] || key;
    newObj[newKey] = obj[key];
  }
  newObj.code = "INVALID_INPUT";
  return newObj;
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

/**
 * Compares an input password with a hashed password using bcrypt.
 * @param {string} inputPassword - The plaintext password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if passwords match, false otherwise.
 * @throws {ParametricError} - Throws a ParametricError if an error occurs during comparison.
 */
export const comparePasswords = async (
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(inputPassword, hashedPassword);
    return match;
  } catch (error) {
    throw new ParametricError([
      {
        param: "password",
        message: "Password does not match.",
        code: "INVALID_INPUT",
      },
    ]);
  }
};
