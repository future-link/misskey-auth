import * as koa from "koa";
import * as Router from "koa-router";
import { accessLogger } from "./logger";
import parseAutorizationHeader, {InternalAuthorizationHeader} from "./utils/parse-authorization-header";
import config from "./config";

interface Endpoint {
  method: "GET"|"POST";
  path: string;
  file: string;
  internal?: boolean;
}

const endpoints: Endpoint[] = [
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
    internal: true,
  },
];

const router = new Router();
endpoints.forEach((endpoint) => {
  let handler = require(`./endpoints${endpoint.file}`);
  handler = handler.default || handler;
  const handlerFunction = async (ctx: koa.Context, next) => {
    accessLogger.info(`${endpoint.method} ${endpoint.path}`);
    // hide internal endpoints & require internal passkey based authentication.
    if (endpoint.internal) {
      const token = await parseAutorizationHeader(ctx.headers.authorization);
      if (token.kind !== "internal") {
        await next();
        return;
      }
      const tokenDoc = token.doc as InternalAuthorizationHeader;
      if (tokenDoc.passkey !== config.passkey) {
        await next();
        return;
      }
    }
    await handler(ctx);
  };

  switch (endpoint.method) {
    case "GET":
      router.get(endpoint.path, handlerFunction);
      break;
    case "POST":
      router.post(endpoint.path, handlerFunction);
      break;
  }
});

export default router;
