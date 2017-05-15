import * as mongoose from "mongoose";
import config from "./config";

let opts: object|undefined;
if (config.mongo.options !== undefined) {
  opts = {
    user: config.mongo.options.user,
    pass: config.mongo.options.password,
  };
}
mongoose.connect(config.mongo.uri, opts);

import application from "./db-models/application";
export const Application = application;
