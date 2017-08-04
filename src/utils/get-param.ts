import { ResponseError, ErrorID } from "./error";
import * as koa from "koa";

export function getParamSource(ctx: koa.Context): object {
  const query = ctx.request.query || {};
  const body = ctx.request.body || {};
  return Object.assign(body, query);
}

export function getParamAsString(source: object, name: string, error?: ErrorID): string {
  const param = source[name];
  if (typeof(param) !== "string") {
    throw new ResponseError(error || "invalid_request", `'${name}' is required`);
  }
  return param;
}
