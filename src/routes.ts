import * as Router from "koa-router";

interface Endpoint {
  method: "GET"|"POST";
  path: string;
  file: string;
}

const endpoints: Endpoint[] = [
  {
    method: "POST",
    path: "/apps/create",
    file: "/apps/create",
  },
  /*
  {
    method: "POST",
    path: "/apps/destroy",
    file: "/apps/destroy",
  },
  {
    method: "POST",
    path: "/apps/show",
    file: "/apps/show",
  },*/

  {
    method: "GET",
    path: "/test",
    file: "/test",
  },
];

const router = new Router();
endpoints.forEach((a) => {
  let handler = require(`./endpoints${a.file}`);
  handler = handler.default || handler;

  switch (a.method) {
    case "GET":
      router.get(a.path, handler);
      break;
    case "POST":
      router.post(a.path, handler);
      break;
  }
});

export default router;
