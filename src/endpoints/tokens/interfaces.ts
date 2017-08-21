export interface TokenResponce {
  access_token: string;
  token_type: string;
}

export interface IntrospectResponse {
  active: boolean;
}
