import { ResponseError } from "./error";
import parseAuthorizationHeader, { InternalAuthorizationHeader } from "./parse-authorization-header";

export default async function validateInternalAccess(header: any): Promise<boolean> {
  const authorization: string|undefined = header.authorization;
  if (authorization === undefined) {
    throw new ResponseError("invalid_request", "internal endpoint");
  }
  const parseResult = await parseAuthorizationHeader(authorization);
  if (parseResult.kind !== "internal") {
    throw new ResponseError("invalid_request", "internal endpoint");
  }
  if ((parseResult.doc as InternalAuthorizationHeader).isValid === false) {
    throw new ResponseError("invalid_request", "invalid passkey");
  }

  return true;
}
