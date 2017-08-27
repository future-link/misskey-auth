import * as koa from "koa";
import { pem2jwk } from "pem-jwk";
import config from "../config";

export default async function cert(ctx: koa.Context) {
  let jwk = pem2jwk(config.jws.publicKey);
  jwk = Object.assign(jwk, {
    use: "sig",
    alg: config.jws.algorithm,
  });

  ctx.body = jwk;
}
