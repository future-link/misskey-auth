import * as createError from "http-errors";

export function getParamAsString(body: object, name: string, error?: string): string {
  const param = body[name];
  if (typeof(param) !== "string") {
    throw createError(400, error || `'${name}' is required.`);
  }
  return param;
}
