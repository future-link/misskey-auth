import * as koa from "koa";

export default async function(ctx: koa.Context) {
  throw new Error("test");
}
