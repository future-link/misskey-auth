import * as koa from "koa";
import { ResponseError } from "../../utils/error";
import parseAuthHeader, { BasicAuthorizationHeader } from "../../utils/parse-authorization-header";
import { getParamSource, getParamAsString } from "../../utils/get-param";
import tokens from "../../models/token";

export default async function create(ctx: koa.Context) {
  const grantType = getParamAsString(getParamSource(ctx), "grant_type");

  switch (grantType) {
    case "password":
      ctx.body = await resourceOwnerPasswordCredentialGrant(ctx);
      return;

    default:
      throw new ResponseError("unsupported_grant_type", `'${grantType}' is unsupported`);
  }
}

interface TokenResponce {
  access_token: string;
  token_type: string;
}

async function resourceOwnerPasswordCredentialGrant(ctx: koa.Context): Promise<TokenResponce> {
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
      // Client credectials MUST NOT be included in the request URI,
      // see https://tools.ietf.org/html/rfc6749#section-2.3.1.
      const source = ctx.request.body || {};
      const id     = getParamAsString(source, "client_id");
      const secret = getParamAsString(source, "client_secret");
      return { id, secret };
    }
  })();

  const source = getParamSource(ctx);
  const username = getParamAsString(source, "username");
  const password = getParamAsString(source, "password");

  const token = await tokens.createUsingPassword(username, password, clientId, clientSecret);
  const signedToken = tokens.sign(token);

  return {
    access_token: signedToken,
    token_type: "bearer",
  };
}
