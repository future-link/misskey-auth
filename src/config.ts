import * as path from "path";
import * as log4js from "log4js";

const configDirName: string = ".misskey";
const configFileName: string = "auth.json";

const homeDir = process.env[
  process.platform === "win32" ? "USERPROFILE" : "HOME"
];
const configPath = path.join(homeDir, configDirName, configFileName);
const config = require(configPath) as Config;
export default config;

export interface Config {
  mongo: {
    uri: string;
    options?: {
      user: string;
      password: string;
    }
  };
  logger: log4js.IConfig;
  apiServer: {
    passkey: string;
    ip: string;
    port: string;
  };
}
