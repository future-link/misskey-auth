import { ResponseError, ErrorID } from "./error";

export function getParamAsString(body: object, name: string, error?: ErrorID): string {
  const param = body[name];
  if (typeof(param) !== "string") {
    throw new ResponseError(error || "invalid_request", `'${name}' is required`);
  }
  return param;
}
