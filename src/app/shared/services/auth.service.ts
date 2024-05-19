import { Injectable } from '@angular/core';
import { User } from '@app-shared/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // TODO: implement fully
  readonly #user$ = new BehaviorSubject<User | null>(null);
  readonly user$ = this.#user$.asObservable();

  get user() {
    return this.#user$.value;
  }

  set user(user: User | null) {
    this.#user$.next(user);
  }

  logOut() {
    this.user = null;
  }
}
