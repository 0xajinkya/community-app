import Sequelize from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { Env } from "./env";
import { Community, Member, Role, User } from "../../schema/v1";
import { Logger } from "../../universe/v1";

export class Database {
  static instance: Sequelize<PostgresDialect>;

  static async Loader() {
    try {
      Database.instance = new Sequelize({
        dialect: PostgresDialect, // The dialect of the database (e.g., 'postgres')
        // database: Env.variable.NODE_POSTGRES_DB,              // Name of the PostgreSQL database
        // user: Env.variable.NODE_POSTGRES_USER,                // Username for database authentication
        // password: Env.variable.NODE_POSTGRES_PASSWORD,        // Password for database authentication
        // host: Env.variable.NODE_POSTGRES_HOST,                // Database host address
        // port: Number(Env.variable.NODE_PORT),        // Port number of the database server
        database: "community", // Name of the PostgreSQL database
        user: "user", // Username for database authentication
        password: "password", // Password for database authentication
        host: "localhost", // Database host address
        port: Number(5432),
        // ssl: Boolean(Env.variable.NODE_POSTGRES_SSL),         // Whether to use SSL for the connection (true/false)
        // logging: false,               // Disable Sequelize's logging (true to enable)
        // clientMinMessages: Env.variable.NODE_POSTGRES_CLIENT_MIN_MESSAGES,  // Minimum message level for client messages
      });
      Database.instance.addModels([User, Role, Community, Member]);
      await Database.instance.sync({alter: true});
      await Database.instance.authenticate();
      Logger.instance.info("Database connection established.");
    } catch (error) {
      Logger.instance.error(error);
      throw new Error("Failed to connect to the database");
    }
  }
}
