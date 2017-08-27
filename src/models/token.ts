import { AccessToken } from "../db";
import { AccessTokenDocument } from "../db-models/access-token";
import * as Application from "./application";
import { ResponseError } from "../utils/error";
import getUser from "../utils/get-user";
import config from "../config";
import jws = require("jws");

async function create(
  userId: string,
  appId: string,
): Promise<AccessTokenDocument> {
  const token = new AccessToken();
  token.userId = userId;
  token.appId = appId;
  token.createdAt = new Date(Date.now());
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
  if (app.isPublicClient) {
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
  return jws.sign({
    header: { alg: config.jws.algorithm },
    payload: {
      sub: token.userId,
      token_id: token._id,
      aud: token.appId,
    },
    secret: config.jws.secretKey,
  });
}

export async function isValidToken(token: string): Promise<boolean> {
  if (!jws.verify(token, config.jws.algorithm, config.jws.publicKey)) {
    return false;
  }

  const payload = JSON.parse(jws.decode(token).payload);

  try {
    return await AccessToken.findById(payload.token_id)
                  .then((a) => a !== null ? a.active : false);
  } catch (err) {
    return false;
  }
}
