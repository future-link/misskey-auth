import * as mongoose from "mongoose";
import config from "./config";
import { systemLogger } from "./logger";

// use native promise
(mongoose as { Promise: any }).Promise = global.Promise;

let opts = {
  useMongoClient: true,
};
if (config.mongo.options !== undefined) {
  opts = Object.assign(opts, config.mongo.options);
}
mongoose.connect(config.mongo.uri, opts)
  .then(() => {
    systemLogger.info(`Success to connent mongodb: ${config.mongo.uri}`);
  })
  .catch((err) => {
    systemLogger.fatal(err.stack || `${err.name}: ${err.message}`);
  });

import application from "./db-models/application";
export const Application = application;

import acccessToken from "./db-models/access-token";
export const AccessToken = acccessToken;
