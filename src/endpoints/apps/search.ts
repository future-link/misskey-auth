import * as koa from "koa";
import { getParamAsString } from "../../utils/get-param";
import apps from "../../models/application";

export default async function search(ctx: koa.Context) {
  const body = ctx.request.body;
  const userId = getParamAsString(body, "user-id");
  const list = await apps.search(userId);
  ctx.body = list.map((a) => {
    delete (a as any)._doc.secret;
    return a;
  });
}
