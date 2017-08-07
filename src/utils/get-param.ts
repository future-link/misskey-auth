import { ResponseError, ErrorID } from "./error";
import * as koa from "koa";

export function getParamSource(ctx: koa.Context): object {
  if (ctx.method === "GET") {
    return ctx.request.query || {};
  } /* POST */ else {
    return ctx.request.body || {};
  }
}

export function getParamAsString(source: object, name: string, error?: ErrorID): string {
  const param = source[name];
  if (typeof(param) !== "string") {
    throw new ResponseError(error || "invalid_request", `'${name}' is required`);
  }
  return param;
}
