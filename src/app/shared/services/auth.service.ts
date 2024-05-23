import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@app-shared/consts';
import {
  JwtTokens,
  SignInUser,
  SignUpUser,
  User,
} from '@app-shared/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  readonly #user$ = new BehaviorSubject<User | null>(null);
  readonly user$ = this.#user$.asObservable();

  readonly baseUrl = `${API_URL}/auth`;

  get user() {
    return this.#user$.value;
  }

  set user(user: User | null) {
    this.#user$.next(user);
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

  logOut() {
    this.user = null;
  }
}
