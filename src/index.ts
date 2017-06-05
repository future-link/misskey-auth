import * as koa from "koa";
import * as bodyParser from "koa-bodyparser";
import router from "./routes";
import * as httpErrors from "http-errors";

const app = new koa();
app
  .use(errorHandler)
  .use(responseFormatter)
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods({
    throw: true,
  }));
app.listen(3001);

async function errorHandler(ctx: koa.Context, next) {
  try {
    await next();
  } catch (e) {
    if (e instanceof httpErrors.HttpError) {
      ctx.status = e.status;
      ctx.body = {
        error: e.message,
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: e.message || "Internal Server Error",
      };
      throw e;
    }
  }
}

async function responseFormatter(ctx: koa.Context, next) {
  await next();
  let body = ctx.response.body;

  const f = (obj: any) => {
    if (obj._id !== undefined) {
      obj.id = obj._id;
      delete obj._id;
    }
    if (obj.__v !== undefined) {
      delete obj.__v;
    }
    return obj;
  };

  if (typeof(body) === "object") {
    if (body._doc === undefined) {
      body = f(body);
    } else {
      body = f(body._doc);
    }
  }

  if (body instanceof Array) {
    body = body.map((a) => {
      if (typeof(a) === "object") {
        if (a._doc === undefined) {
          return f(a);
        } else {
          return f(Object.assign({}, a._doc));
        }
      } else {
        return a;
      }
    });
  }

  ctx.body = body;
}
