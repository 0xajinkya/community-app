import express, { Application } from "express";
import { Database, Env, FrameworkLoader } from "./loaders/v1";
import { NonParametricError } from "./errors";
import { globalErrorHandler } from "./middlewares";
import cors from "cors";
import { Logger } from "./universe/v1";
import { appRouter } from "./api/v1";
import cookieSession from "cookie-session";

export const server = async () => {
  const app = express();

  Logger.Loader();
  Env.Loader();
  await Database.Loader();
  FrameworkLoader(app);

  app.use(express.json());
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(
    cookieSession({
      signed: false,
      secure: Env.variable.NODE_ENV !== "development",
      secret: Env.variable.NODE_COOKIE_SECRET,
    })
  );
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "x-client-key",
        "x-client-token",
        "x-client-secret",
        "Authorization",
        "Accept",
      ],
    })
  );
  app.use("/v1", appRouter);
  Logger.instance.info("Routes mounted");
  app.get("*", (req, res, next) => {
    next(
      new NonParametricError([
        { message: "Route not found", code: "RESOURCE_NOT_FOUND" },
      ])
    );
    ``;
  });

  app.use(globalErrorHandler);
  return app;
};
