import * as koa from "koa";
import router from "./routes";
import * as httpErrors from "http-errors";

const app = new koa();
app
  .use(errorHandler)
  .use(router.routes())
  .use(router.allowedMethods({
    throw: true,
  }));
app.listen(3000);

async function errorHandler(ctx: koa.Context, next) {
  try {
    await next();
  } catch (e) {
    if (e instanceof httpErrors.HttpError) {
      ctx.status = e.status;
      Object.assign(ctx.response.headers, e.headers || {});
      ctx.body = {
        error: e.message,
      };
    } else {
      throw e;
    }
  }
}
