import * as createError from "http-errors";

export interface AuthorizationHeader {
  kind: "basic"|"bearer";
  doc: BasicAuthorizationHeader|BearerAuthorizationHeader;
}

export interface BasicAuthorizationHeader {
  id: string;
  secret: string;
}

export interface BearerAuthorizationHeader {
  token: string;
}

export default function parseAutorizationHeader(header: string): AuthorizationHeader {
  if (/^\s*[\w\-]\s+[^\s]+\s*$/.test(header)) {
    const parts = header.split(" ").map((a) => a.trim());
    const scheme = parts[0].toLowerCase();
    const data = parts[1];
    switch (scheme) {
      case "basic":
        const [id, secret] = new Buffer(data, "base64").toString("utf8");
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

      default:
        throw createError(401, "Invalid authorization scheme");
    }
  } else {
    throw createError(401);
  }
}
