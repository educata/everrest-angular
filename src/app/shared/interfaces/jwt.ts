export interface JwtTokens {
  access_token: string;
  refresh_token: string;
}

export interface JwtTimes {
  iat: number;
  exp: number;
}
