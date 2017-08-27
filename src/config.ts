import * as path from "path";
import * as fs from "fs";
import * as log4js from "log4js";

const configDirName: string = ".misskey";
const configFileName: string = "auth.json";

const homeDir = process.env[
  process.platform === "win32" ? "USERPROFILE" : "HOME"
] as string;

const configPath = path.join(homeDir, configDirName, configFileName);
const config = require(configPath) as Config;
config.jws.publicKey = fs.readFileSync(path.join(homeDir, configDirName, config.jws.publicKeyFile), "utf8");
config.jws.secretKey = fs.readFileSync(path.join(homeDir, configDirName, config.jws.secretKeyFile), "utf8");
export default config;

export interface Config {
  passkey: string;
  jws: {
    algorithm: string;
    secretKey: string;
    secretKeyFile: string;
    publicKey: string;
    publicKeyFile: string;
  };
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
