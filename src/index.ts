// import path from "path";
// import dotenv from "dotenv";

// // Resolve the root directory
// // Load environment variables from .env.local file
// const rootDir = path.resolve(__dirname, "..");
// dotenv.config({ path: path.join(rootDir, ".env.local") });
import { server } from "./server";
import { Env } from "./loaders/v1";
import { Logger } from "./universe/v1";

/**
 * Initializes the Express server with Sequelize database connection.
 * Logs connection status and starts the server on specified port.
 */
(async () => {
  const app = await server();

  app.listen(Env.variable.NODE_PORT, () =>
    Logger.instance.debug(`Running on port ${Env.variable.NODE_PORT}`)
  );
})();
