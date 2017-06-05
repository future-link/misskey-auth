import { Application } from "../db";
import { ApplicationDocument } from "../db-models/application";
import * as crypto from "crypto";

class ApplicationModel {
  public async create(
    appName: string,
    userId: string,
    description: string,
    callbackURL: string|undefined,
    isPublicClient: boolean = false,
  ): Promise<ApplicationDocument> {
    if ((await Application.findOne({name: appName, userId})) != null) {
      throw new Error("duplicate application");
    }

    const app = new Application();
    app.name = appName;
    app.userId = userId;
    app.secret = crypto.randomBytes(32).toString("base64");
    app.createdAt = new Date().toISOString();

    app.description = description;
    app.callbackURL = callbackURL;
    app.isPublicClient = isPublicClient;

    return await app.save();
  }
}

const model = new ApplicationModel();
export default model;
