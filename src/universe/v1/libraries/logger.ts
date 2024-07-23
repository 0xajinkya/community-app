import winston from "winston";

export class Logger {
  static instance: winston.Logger | Console;

  static Loader = (): void => {
    const loggerFormat = winston.format.combine(
      winston.format.cli(),
      winston.format.splat(),
      winston.format.errors({ stack: true })
    );

    let transports: winston.transport[] = [new winston.transports.Console()];

    Logger.instance = winston.createLogger({
      level: "debug",
      format: loggerFormat,
      transports,
    });
  };
}