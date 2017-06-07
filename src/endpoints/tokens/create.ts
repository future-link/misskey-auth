import * as koa from "koa";
import * as createError from "http-errors";
import parseAuthHeader, { BasicAuthorizationHeader } from "../../utils/parse-authorization-header";
import { getParamAsString } from "../../utils/get-param";
import mapErr from "../../utils/map-err";
import tokens from "../../models/token";

export default async function create(ctx: koa.Context) {
  const grantType = getParamAsString(ctx.request.body, "grant_type", "invalid_request");

  switch (grantType) {
    case "password":
      await resourceOwnerPasswordCredentialGrant(ctx);
      return;

    default:
      throw createError(400, "unsupported_grant_type");
  }
}

async function resourceOwnerPasswordCredentialGrant(ctx: koa.Context) {
  const { id: clientId, secret: clientSecret } = (() => {
    if (ctx.header.Authorization !== undefined) {
      const parsed = mapErr(
        () => parseAuthHeader(ctx.header.Authorization),
        (err: createError.HttpError) => {
          if (err.message === "Invalid authorization scheme") {
            ctx.response.header["WWW-Authenticate"] = `Basic realm="SECRET AREA"`;
            return createError(401, "invalid_client");
          } else {
            return createError(400, "invalid_request");
          }
        },
      );
      if (parsed.kind === "basic") {
        return parsed.doc as BasicAuthorizationHeader;
      } else {
        ctx.response.header["WWW-Authenticate"] = `Basic realm="SECRET AREA"`;
        throw createError(401, "invalid_client");
      }
    }

    const body = ctx.request.body;
    const id     = getParamAsString(body, "client_id", "invalid_request");
    const secret = getParamAsString(body, "client_secret", "invalid_request");
    return { id, secret };
  })();

  const body = ctx.request.body;
  const username = getParamAsString(body, "username", "invalid_request");
  const password = getParamAsString(body, "password", "invalid_request");

  const token = await tokens.createUsingPassword(username, password, clientId, clientSecret);
  const signedToken = tokens.sign(token);

  ctx.body = {
    access_token: signedToken,
    token_type: "bearer",
  };
}
