import { Application } from "../db";
import { ApplicationDocument } from "../db-models/application";
import * as crypto from "crypto";
import * as createError from "http-errors";

class ApplicationModel {
  public async create(
    appName: string,
    userId: string,
    description: string,
    callbackURL: string|undefined,
    isPublicClient: boolean = false,
  ): Promise<ApplicationDocument> {
    if ((await Application.findOne({name: appName, userId})) != null) {
      throw createError(400, "Duplicate application");
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

  public async destroy(appId: string, appSecret: string): Promise<void> {
    const app = await Application.findById(appId);
    if (app == null) {
      throw createError(404, "Application not found");
    }
    if (app.secret !== appSecret) {
      throw createError(400, "Invalid secret");
    }

    await Application.remove({_id: appId});
  }

  public async show(id: string): Promise<ApplicationDocument> {
    const app = await Application.findById(id);
    if (app == null) {
      throw createError(404, "Application not found");
    }
    return app;
  }
}

const model = new ApplicationModel();
export default model;
