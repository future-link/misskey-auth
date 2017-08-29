import { Application } from "../db";
import { ApplicationDocument } from "../db-models/application";
import * as crypto from "crypto";
import { ResponseError } from "../utils/error";

export async function create(
  appName: string,
  userId: string,
  description: string,
  callbackURL: string|undefined,
  isPublicClient: boolean = true,
): Promise<ApplicationDocument> {
  if ((await Application.findOne({name: appName, userId})) != null) {
    throw new ResponseError("invalid_request", "you have already registered same application");
  }

  const app = new Application();
  app.name = appName;
  app.userId = userId;
  app.secret = crypto.randomBytes(32).toString("base64");

  app.description = description;
  app.callbackURL = callbackURL;
  app.isPublicClient = isPublicClient;

  return (await app.save()).toObject() as ApplicationDocument;
}

export async function destroy(appId: string, appSecret: string): Promise<void> {
  const app = await Application.findById(appId);
  if (app == null) {
    throw new ResponseError("not_found", "application not found");
  }
  if (app.secret !== appSecret) {
    throw new ResponseError("invalid_request", "invalid secret");
  }

  await Application.remove({_id: appId});
}

export async function show(id: string): Promise<ApplicationDocument> {
  const app = await Application.findById(id);
  if (app == null) {
    throw new ResponseError("not_found", "application not found");
  }
  return app.toObject() as ApplicationDocument;
}

export async function search(userId: string): Promise<ApplicationDocument[]> {
  return (await Application.find({userId})).map((a) => a.toObject() as ApplicationDocument);
}
