import * as koa from "koa";
import { ResponseError } from "../../utils/error";
import getUser from "../../utils/get-user";
import { getParamAsString } from "../../utils/get-param";
import * as apps from "../../models/application";

export default async function show(ctx: koa.Context) {
  const body = ctx.request.body;
  const appId = getParamAsString(body, "app-id");

  if (body["app-secret"] !== undefined) {
    const appSecret = getParamAsString(body, "app-secret");

    const app = await apps.show(appId, true);
    if (appSecret === app.secret) {
      ctx.body = app;
      return;
    } else {
      throw new ResponseError("invalid_request", "invalid secret").setStatus(401);
    }
  }
  if (body["screen-name"] !== undefined || body.password !== undefined) {
    const userName = getParamAsString(body, "screen-name");
    const password = getParamAsString(body, "password");
    await getUser(userName, password);
    ctx.body = await apps.show(appId, true);
    return;
  }

  ctx.body = await apps.show(appId, false);
}
