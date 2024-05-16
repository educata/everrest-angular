import { Component, inject } from '@angular/core';
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
import { BreakpointService } from '@app-shared/services';
import { NAVIGATIONS, TITLE } from '@app-shared/consts';
import { filter, map } from 'rxjs';

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
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly breakpointService = inject(BreakpointService);

  readonly navigations = NAVIGATIONS;
  readonly title = TITLE;

  readonly isHandset$ = this.breakpointService.isHandset$;
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
}
