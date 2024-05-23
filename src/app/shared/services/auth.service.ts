import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@app-shared/consts';
import {
  ErrorResponse,
  JwtTokens,
  SignInUser,
  SignUpUser,
  User,
} from '@app-shared/interfaces';
import { BehaviorSubject, EMPTY, catchError, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { SweetAlertService } from './sweet-alert2.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtService = inject(JwtService);
  private readonly alertService = inject(SweetAlertService);

  readonly #user$ = new BehaviorSubject<User | null>(null);
  readonly user$ = this.#user$.asObservable();

  readonly baseUrl = `${API_URL}/auth`;

  constructor() {
    this.init();

    setInterval(() => {
      this.checkUser();
    }, 300000);
  }

  get user() {
    return this.#user$.value;
  }

  set user(user: User | null) {
    this.#user$.next(user);
  }

  init() {
    const token = this.jwtService.accessToken;
    if (token) {
      try {
        this.user = this.jwtService.decodeToken(token);
        if (!this.user?.verified) {
          this.router.navigateByUrl('/verify');
        }
        this.checkUser();
      } catch (err) {
        console.log(err);
        this.router.navigateByUrl('/');
        this.jwtService.removeTokens();
      }
    }
  }

  signUp(user: SignUpUser) {
    return this.http.post<User>(`${this.baseUrl}/sign_up`, { ...user });
  }

  signIn(user: SignInUser) {
    return this.http.post<JwtTokens>(`${this.baseUrl}/sign_in`, { ...user });
  }

  refreshToken() {
    return this.http.post<JwtTokens>(`${this.baseUrl}/refresh`, {});
  }

  checkUser() {
    if (!this.user) {
      return;
    }

    this.http
      .get<User>(this.baseUrl)
      .pipe(
        tap((user) => {
          this.user = user;
        }),
        catchError((err) => {
          const errorKeys = err.error.errorKeys;

          if (errorKeys.includes('errors.user_email_not_verified')) {
            this.router.navigateByUrl('/verify');
          } else if (errorKeys.includes('errors.token_expired')) {
            this.handleRefresh();
          } else {
            this.router.navigateByUrl('/');
            this.jwtService.removeTokens();
            this.user = null;
          }

          return EMPTY;
        }),
      )
      .subscribe();
  }

  handleTokens(response: JwtTokens) {
    const { access_token, refresh_token } = response;
    this.jwtService.accessToken = access_token;
    this.jwtService.refreshToken = refresh_token;
    this.user = this.jwtService.decodeToken(access_token);

    if (!this.user?.verified) {
      this.router.navigateByUrl('/verify');
      return;
    }

    this.router.navigateByUrl('/');
  }

  handleRefresh() {
    if (!this.jwtService.accessToken || !this.jwtService.refreshToken) {
      this.jwtService.removeTokens();
      this.user = null;
      return;
    }

    this.refreshToken()
      .pipe(
        tap((tokens) => {
          this.jwtService.accessToken = tokens.access_token;
          this.jwtService.refreshToken = tokens.refresh_token;
          this.user = this.jwtService.decodeToken(tokens.access_token);
        }),
        catchError(() => {
          this.router.navigateByUrl('/');
          this.jwtService.removeTokens();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  logOut() {
    this.user = null;
    this.jwtService.removeTokens();
    this.alertService.toast('Successfully log outed', 'success', 'green');
    this.router.navigateByUrl('/');
  }

  checkVerify(user: User) {
    if (!user.verified) {
      this.router.navigateByUrl('/verify');
      this.alertService.toast('First verify', 'warning', 'orange');
    }
  }

  canActivate(url: string) {
    const token = this.jwtService.accessToken;

    if (!token) {
      return false;
    }

    try {
      const user = this.jwtService.decodeToken(token) as User;

      if (!user) {
        return false;
      }

      if (this.jwtService.isTokenExpired(token)) {
        return false;
      }

      if (!user.verified) {
        this.router.navigateByUrl('/verify');
      }

      if (url === '/verify') {
        this.router.navigateByUrl('/');
      }

      return true;
    } catch (err) {
      this.router.navigateByUrl('/auth');
      this.jwtService.removeTokens();
      return false;
    }
  }

  canAuth() {
    const token = this.jwtService.accessToken;

    if (token) {
      try {
        const user = this.jwtService.decodeToken(token) as User;

        if (!user) {
          return true;
        }

        if (this.jwtService.isTokenExpired(token)) {
          return true;
        }

        this.router.navigateByUrl('/');
        return false;
      } catch (_) {
        this.jwtService.removeTokens();
        return true;
      }
    }

    return true;
  }
}

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AuthService).canActivate(state.url);
};

export const canAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AuthService).canAuth();
};
