import * as koa from "koa";
import getUser from "../../utils/get-user";
import { getParamAsString } from "../../utils/get-param";
import * as apps from "../../models/application";

export default async function(ctx: koa.Context) {
  const body = ctx.request.body;
  const userName    = getParamAsString(body, "screen-name");
  const password    = getParamAsString(body, "password");
  const appName     = getParamAsString(body, "app-name");
  const description = getParamAsString(body, "description");
  const callbackURL: string|undefined = body.callbackURL;

  const user: {id: string} = await getUser(userName, password);
  ctx.body = await apps.create(
    appName,
    user.id,
    description,
    callbackURL,
    "public",
  );
  ctx.status = 201;
}
