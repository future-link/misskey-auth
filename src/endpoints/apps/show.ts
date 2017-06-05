import * as koa from "koa";
import * as createError from "http-errors";
import getUser from "../../utils/get-user";
import { getParamAsString } from "../../utils/get-param";
import apps from "../../models/application";

export default async function show(ctx: koa.Context) {
  const body = ctx.request.body;
  const appId = getParamAsString(body, "app-id");

  const app = await apps.show(appId);

  if (body["app-secret"] !== undefined) {
    const appSecret = getParamAsString(body, "app-secret");
    if (appSecret === app.secret) {
      ctx.body = app;
      return;
    } else {
      throw createError(401);
    }
  }
  if (body["screen-name"] !== undefined || body.password !== undefined) {
    const userName = getParamAsString(body, "screen-name");
    const password = getParamAsString(body, "password");
    await getUser(userName, password);
    ctx.body = app;
    return;
  }

  delete app.secret;
  ctx.body = app;
}
