import * as koa from "koa";
import * as Router from "koa-router";
import { accessLogger } from "./logger";

interface Endpoint {
  method: "GET"|"POST";
  path: string;
  file: string;
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/cert",
    file: "/cert",
  },
  {
    method: "POST",
    path: "/apps/create",
    file: "/apps/create",
  },
  {
    method: "POST",
    path: "/apps/destroy",
    file: "/apps/destroy",
  },
  {
    method: "POST",
    path: "/apps/show",
    file: "/apps/show",
  },
  {
    method: "POST",
    path: "/apps/search",
    file: "/apps/search",
  },

  {
    method: "GET",
    path: "/tokens/create",
    file: "/tokens/create",
  },
  {
    method: "POST",
    path: "/tokens/create",
    file: "/tokens/create",
  },

  {
    method: "POST",
    path: "/tokens/introspect",
    file: "/tokens/introspect",
  },
];

const router = new Router();
endpoints.forEach((a) => {
  let handler = require(`./endpoints${a.file}`);
  handler = handler.default || handler;
  const handlerFunction = async (ctx: koa.Context, next) => {
    accessLogger.info(`${a.method} ${a.path}`);
    await handler(ctx);
  };

  switch (a.method) {
    case "GET":
      router.get(a.path, handlerFunction);
      break;
    case "POST":
      router.post(a.path, handlerFunction);
      break;
  }
});

export default router;
