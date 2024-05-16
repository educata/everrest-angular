import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';

import { TITLE, TITLE_SEPARATOR } from '@app-shared/consts';

@Injectable()
export class EcTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    this.title.setTitle(title);
  }

  override buildTitle(snapshot: RouterStateSnapshot) {
    let route: ActivatedRouteSnapshot = snapshot.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    let title = TITLE;

    if (route.routeConfig && route.routeConfig.title) {
      title += ` ${TITLE_SEPARATOR} ${route.routeConfig.title}`;
    }

    return title;
  }
}
