import { Injectable } from '@angular/core';
import { JWTErrorKeys, StorageKeys } from '@app-shared/enums';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  get accessToken() {
    return localStorage.getItem(StorageKeys.AccessToken) as string;
  }

  set accessToken(token: string) {
    if (!token) {
      throw new Error('Invalid access token');
    }

    localStorage.setItem(StorageKeys.AccessToken, token);
  }

  get refreshToken() {
    return localStorage.getItem(StorageKeys.RefreshToken) as string;
  }

  set refreshToken(token: string) {
    if (!token) {
      throw new Error('Invalid refresh token');
    }

    localStorage.setItem(StorageKeys.RefreshToken, token);
  }

  removeTokens() {
    localStorage.removeItem(StorageKeys.AccessToken);
    localStorage.removeItem(StorageKeys.RefreshToken);
  }

  // credits for decoder goes to https://github.com/atk & angular2-jwt

  decodeToken(token: string) {
    if (!token || token === '') {
      return null;
    }

    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error(
        `The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.`,
        { cause: JWTErrorKeys.INVALID_JWT },
      );
    }

    const decoded = this.urlBase64Decode(parts[1]);

    if (!decoded) {
      throw new Error('Cannot decode the token.', {
        cause: JWTErrorKeys.INVALID_JWT,
      });
    }

    return JSON.parse(decoded);
  }

  isTokenExpired(token: string | null, offsetSeconds?: number): boolean {
    if (!token || token === '') {
      return true;
    }
    const date = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;

    if (date === null) {
      return false;
    }

    return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
  }

  private b64decode(str: string): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';

    str = String(str).replace(/=+$/, '');

    if (str.length % 4 === 1) {
      throw new Error(
        `'atob' failed: The string to be decoded is not correctly encoded.`,
      );
    }

    for (
      // initialize result and counters
      let bc = 0, bs: any, buffer: any, idx = 0;
      // get next character
      (buffer = str.charAt(idx++));
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer &&
      ((bs = bc % 4 ? bs * 64 + buffer : buffer),
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  }

  private b64DecodeUnicode(str: any) {
    return decodeURIComponent(
      Array.prototype.map
        .call(this.b64decode(str), (c: any) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
  }

  private urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: {
        break;
      }
      case 2: {
        output += '==';
        break;
      }
      case 3: {
        output += '=';
        break;
      }
      default: {
        throw new Error('Illegal base64url string!');
      }
    }
    return this.b64DecodeUnicode(output);
  }

  private getTokenExpirationDate(token: string): Date | null {
    let decoded = this.decodeToken(token);

    if (!decoded || !decoded.hasOwnProperty('exp')) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
  }
}
