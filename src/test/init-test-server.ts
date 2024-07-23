import { server } from "../server"
import { Env } from '@loaders/v1';

export const initTestServer = async () => {
  try {
    const app = await server()
    const serverr = app.listen(Env.variable.NODE_PORT, () => {
      console.log(`Express test server is listening on port ${Env.variable.NODE_PORT}`);
    });

    return { app, server: serverr } ;
  } catch (error) {
    console.error('Unable to connect to the test database:', error);
    throw error; // Throw error to indicate initialization failure
  }
};
