import * as koa from "koa";
import * as tokens from "../../models/token";

interface IntrospectResponse {
  active: boolean;
}

export default async function introspect(ctx: koa.Context) {
  const token = ctx.request.body.token;
  if (!token) {
    ctx.throw(500, ":fu:");
  }
  ctx.body = {
    active: await tokens.check(token),
  } as IntrospectResponse;
}
