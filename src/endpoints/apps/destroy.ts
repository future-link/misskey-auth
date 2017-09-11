import * as koa from "koa";
import { getParamAsString } from "../../utils/get-param";
import * as apps from "../../models/application";

export default async function destroy(ctx: koa.Context) {
  const body = ctx.request.body;
  const appId = getParamAsString(body, "app-id");
  const appSecret = getParamAsString(body, "app-secret");
  await apps.destroy(appId, appSecret);

  ctx.body = {};
}
