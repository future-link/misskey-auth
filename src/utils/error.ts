export type ErrorID =
  | "invalid_request"
  | "not_found"
  | "invalid_client"
  | "invalid_grant"
  | "unauthorized_client"
  | "unsupported_grant_type"
  | "internal_error";

export class ResponseError extends Error {
  public error: ErrorID;
  public statusCode: number;
  public description: string;
  public uri: string | undefined;

  public constructor(
    error: ErrorID,
    description: string,
    uri?: string,
    code?: number
  ) {
    super(error);

    this.error = error;
    this.description = description;
    this.uri = uri;
    if (code !== undefined) {
      this.statusCode = code;
    } else {
      switch (error) {
        case "internal_error":
          this.statusCode = 500;
          break;
        case "not_found":
          this.statusCode = 404;
          break;
        default:
          this.statusCode = 400; // 臨機応変に、ですか。
          break;
      }
    }
  }

  public setStatus(code: number): ResponseError {
    this.statusCode = code;
    return this;
  }
}
