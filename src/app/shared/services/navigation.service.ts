import { Injectable, inject } from '@angular/core';
import { NAVIGATIONS } from '@app-shared/consts';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly authService = inject(AuthService);

  readonly navigation$ = this.authService.user$.pipe(
    map((user) => {
      const isUserAuth = Boolean(user);
      const navigation = NAVIGATIONS.filter((nav) => {
        const defaultPaths = !nav.hideAfterAuth && !nav.auth;
        const beforeAuthPaths = !isUserAuth && !nav.auth && nav.hideAfterAuth;
        const afterAuthPaths = isUserAuth && nav.auth && !nav.hideAfterAuth;
        return defaultPaths || beforeAuthPaths || afterAuthPaths;
      });
      return navigation;
    }),
  );
}
