import * as koa from "koa";
import * as tokens from "../../models/token";
import { TokenResponce, IntrospectResponse } from "./interfaces";

export default async function introspect(ctx: koa.Context) {
  if (!ctx.request.body.token) {
    ctx.throw(500, ":fu:");
  }
  const token = ctx.request.body.token as TokenResponce;
  ctx.body = {
    active: await tokens.validate(token),
  } as IntrospectResponse;
}
