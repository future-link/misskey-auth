import config from "../config";
import { ResponseError } from "./error";

export interface AuthorizationHeader {
  kind: "basic"|"bearer"|"internal";
  doc: BasicAuthorizationHeader|BearerAuthorizationHeader|InternalAuthorizationHeader;
}

export interface BasicAuthorizationHeader {
  id: string;
  secret: string;
}

export interface BearerAuthorizationHeader {
  token: string;
}

export interface InternalAuthorizationHeader {
  passekey: string;
  isValid: boolean;
}

export default async function parseAutorizationHeader(header: string): Promise<AuthorizationHeader> {
  if (/^\s*[\w\-]+\s+[^\s]+\s*$/.test(header)) {
    const parts = header.split(" ").map((a) => a.trim());
    const scheme = parts[0].toLowerCase();
    const data = parts[1];
    switch (scheme) {
      case "basic":
        const [id, secret] = new Buffer(data, "base64").toString("utf8").split(":");
        return {
          kind: "basic",
          doc: {
            id, secret,
          },
        };
      case "bearer":
        return {
          kind: "bearer",
          doc: {
            token: data,
          },
        };
      case "internal":
        return {
          kind: "internal",
          doc: {
            passekey: data,
            isValid: data === config.passkey,
          },
        };

      default:
        throw new ResponseError("invalid_request", `scheme '${scheme} is unsupported`).setStatus(401);
    }
  } else {
    throw new ResponseError("invalid_request", "invalid header");
  }
}
