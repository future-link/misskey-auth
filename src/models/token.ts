import { AccessToken } from "../db";
import { AccessTokenDocument } from "../db-models/access-token";
import * as Application from "./application";
import { ResponseError } from "../utils/error";
import getUser from "../utils/get-user";
import config from "../config";
import * as jwt from "jsonwebtoken";

async function create(
  userId: string,
  appId: string,
): Promise<AccessTokenDocument> {
  const token = new AccessToken();
  token.userId = userId;
  token.appId = appId;
  token.createdAt = new Date().toISOString();
  token.active = true;

  return (await token.save()).toObject() as AccessTokenDocument;
}

export async function createUsingPassword(
  username: string,
  password: string,
  appId: string,
  appSecret: string,
): Promise<AccessTokenDocument> {
  const app = await Application.show(appId).catch(
    (err) => Promise.reject(new ResponseError("invalid_client", "invalid client_id")),
  );

  // Is app 'confidential' client?
  if (app.clientType !== "confidential") {
    throw new ResponseError("unauthorized_client", "client must be 'confidential' on 'password' grant");
  }
  if (app.secret !== appSecret) {
    throw new ResponseError("unauthorized_client", "invalid client_secret");
  }

  const user: {id: string} = await getUser(username, password).catch(
    (e) => Promise.reject(new ResponseError("invalid_grant", "invalid credentials")),
  );

  return await create(user.id, appId);
}

export function sign(token: AccessTokenDocument): string {
  return jwt.sign({
      sub: token.userId,
      token_id: token._id,
      aud: token.appId,
    },
    config.jws.secretKey,
    { algorithm: config.jws.algorithm },
  );
}

export async function isValidToken(token: string): Promise<boolean> {
  if (!jwt.verify(token, config.jws.publicKey, { algorithms: [config.jws.algorithm] })) {
    return false;
  }

  const payload = jwt.decode(token, { json: true }) as any;

  try {
    return await AccessToken.findById(payload.token_id)
                  .then((a) => a !== null ? a.active : false);
  } catch (err) {
    return false;
  }
}
