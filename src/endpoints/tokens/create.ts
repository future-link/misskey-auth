import * as koa from "koa";
import { ResponseError } from "../../utils/error";
import parseAuthHeader, { BasicAuthorizationHeader } from "../../utils/parse-authorization-header";
import { getParamAsString } from "../../utils/get-param";
import tokens from "../../models/token";

export default async function create(ctx: koa.Context) {
  const grantType = getParamAsString(ctx.request.body, "grant_type");

  switch (grantType) {
    case "password":
      await resourceOwnerPasswordCredentialGrant(ctx);
      return;

    default:
      throw new ResponseError("unsupported_grant_type", `'${grantType}' is unsupported`);
  }
}

async function resourceOwnerPasswordCredentialGrant(ctx: koa.Context) {
  const { id: clientId, secret: clientSecret } = await (async () => {
    const schemeError = () => {
      ctx.response.header["WWW-Authenticate"] = `Basic realm="SECRET AREA"`;
      return new ResponseError("invalid_client", "scheme must be 'BASIC'").setStatus(401);
    };

    if (ctx.header.authorization !== undefined) {
      return await parseAuthHeader(ctx.header.authorization)
        .catch((err: ResponseError) => {
          throw err.description !== "invalid header" ? schemeError() : err;
        })
        .then((res) => {
          if (res.kind === "basic") {
            return res.doc as BasicAuthorizationHeader;
          } else {
            throw schemeError();
          }
        });
    } else {
      const body = ctx.request.body;
      const id     = getParamAsString(body, "client_id");
      const secret = getParamAsString(body, "client_secret");
      return { id, secret };
    }
  })();

  const body = ctx.request.body;
  const username = getParamAsString(body, "username");
  const password = getParamAsString(body, "password");

  const token = await tokens.createUsingPassword(username, password, clientId, clientSecret);
  const signedToken = tokens.sign(token);

  ctx.body = {
    access_token: signedToken,
    token_type: "bearer",
  };
}
