import * as request from "request-promise-native";
import * as createError from "http-errors";
import config from "../config";

export default async function getUser(screenName: string, password: string): Promise<any> {
  const options: request.RequestPromiseOptions  = {
    method: "POST",
    headers: {
      passkey: config.apiServer.passkey,
    },
    form: {
      "screen-name": screenName,
      "password": password,
    },
  };

  const url = `http://${config.apiServer.ip}:${config.apiServer.port}/login`;

  let user: any;
  try {
    user = JSON.parse(await request(url, options));
  } catch (err) {
    throw createError(401); // きゅーそくせんこー
  }

  return user;
}
