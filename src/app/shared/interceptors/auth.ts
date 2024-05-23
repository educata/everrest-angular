import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JWTErrorKeys, JWTHeaders } from '@app-shared/enums';
import { JwtService } from '@app-shared/services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);

  const authToken = jwtService.accessToken;

  let hasError = false;

  try {
    jwtService.decodeToken(authToken);
  } catch (err) {
    const error = err as Error;
    if (error.cause === JWTErrorKeys.INVALID_JWT) {
      console.warn(error.message);
      jwtService.removeTokens();
    }
    hasError = true;
  }

  const isTokenExpired = authToken && jwtService.isTokenExpired(authToken);

  if (isTokenExpired) {
    console.warn('JWT token is expired');
  }

  return next(
    hasError
      ? req.clone()
      : req.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
            [JWTHeaders.TokenIsExpired]: String(isTokenExpired),
          },
        }),
  );
};
