import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import {
  AuthService,
  BreakpointService,
  NavigationService,
} from '@app-shared/services';
import { TITLE } from '@app-shared/consts';
import { filter, map, tap } from 'rxjs';

@Component({
  selector: 'ec-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly breakpointService = inject(BreakpointService);
  private readonly navigationService = inject(NavigationService);

  readonly title = TITLE;

  readonly isHandset$ = this.breakpointService.isHandset$;
  readonly navigation$ = this.navigationService.navigation$;

  readonly pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => {
      let route = this.activatedRoute.snapshot;

      while (route.firstChild) {
        route = route.firstChild;
      }

      return route.title || '';
    }),
  );

  readonly user$ = this.authService.user$.pipe(
    tap((user) => {
      if (user) {
        this.authService.checkVerify(user);
      }
    }),
  );

  logOut() {
    this.authService.logOut();
  }
}
