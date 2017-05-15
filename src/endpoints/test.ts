import * as koa from "koa";
// import * as createError from "http-errors";

export default async function(ctx: koa.Context) {
  throw new Error("test");
}
