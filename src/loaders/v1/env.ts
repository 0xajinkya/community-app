import { Logger } from "../../universe/v1";

export class Env {
  static names = [
    "NODE_ENV",
    "NODE_PORT",
    "NODE_COOKIE_SECRET",
    "NODE_JWT_SECRET",
    "NODE_POSTGRES_DB",
    "NODE_POSTGRES_USER",
    "NODE_POSTGRES_PASSWORD",
    "NODE_POSTGRES_HOST",
    "NODE_POSTGRES_PORT",
    "NODE_POSTGRES_SSL",
    "NODE_POSTGRES_CLIENT_MIN_MESSAGES",
  ] as const;

  static variable: Record<(typeof Env.names)[number], string>;

  static Loader() {
    const values: Record<string, string> = {};

    for (const key of Env.names) {
      const value = process.env[key];
      console.log(value)
      if (value) {
        values[key] = value;
      } else {
        console.error(`Environment variable ${key} is not defined.`);
        process.exit(1);
      }
    }
    Env.variable = values;
    Logger.instance.info("ENV Variables initialized.")
  }
}