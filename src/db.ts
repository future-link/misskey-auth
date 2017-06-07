import * as mongoose from "mongoose";
import config from "./config";
import { systemLogger } from "./logger";

// use native promise
(mongoose as { Promise: any }).Promise = global.Promise;

let opts: object|undefined;
if (config.mongo.options !== undefined) {
  opts = {
    user: config.mongo.options.user,
    pass: config.mongo.options.password,
  };
}
mongoose.connect(config.mongo.uri, opts, (err) => {
  if (err == null) {
    systemLogger.info(`Success to connent mongodb: ${config.mongo.uri}`);
  } else {
    systemLogger.fatal(err.stack || `${err.name}: ${err.message}`);
  }
});

import application from "./db-models/application";
export const Application = application;

import acccessToken from "./db-models/access-token";
export const AccessToken = acccessToken;
