import * as koa from "koa";
import { ResponseError } from "../../utils/error";
import { getParamAsString } from "../../utils/get-param";
import validateInternalAccess from "../../utils/validate-internal-access";
import * as tokens from "../../models/token";

export default async function introspect(ctx: koa.Context) {
  await validateInternalAccess(ctx.request.header);

  const source = ctx.request.body;
  const token = getParamAsString(source, "token");

  ctx.body = {
    active: await tokens.isValidToken(token)
  };
}
