import * as logger from "log4js";
import config from "./config";

logger.configure(
  config.logger || {
    appenders: [
      {
        type: "console",
        category: "system"
      },
      {
        type: "console",
        category: "access"
      },
      {
        type: "console",
        category: "error"
      }
    ]
  }
);

export const systemLogger = logger.getLogger("system");
export const accessLogger = logger.getLogger("access");
export const errorLogger = logger.getLogger("error");
