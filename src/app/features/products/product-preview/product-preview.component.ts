import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Product } from '@app-shared/interfaces';
import { AuthService, ProductService } from '@app-shared/services';
import { CarouselComponent, LoadingComponent } from '@app-shared/ui';
import { MatListModule } from '@angular/material/list';
import { BehaviorSubject, filter, tap } from 'rxjs';
import { CapitalisePipe } from '@app-shared/pipes';

@Component({
  selector: 'ec-product-preview',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CarouselComponent,
    LoadingComponent,
    MatListModule,
    AsyncPipe,
    DatePipe,
    CapitalisePipe,
  ],
  templateUrl: './product-preview.component.html',
  styleUrl: './product-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductPreviewComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly productService = inject(ProductService);

  readonly product$ = new BehaviorSubject<Product | null>(null);
  readonly user$ = this.auth.user$;

  constructor() {
    this.loadProduct();

    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event) => event instanceof NavigationEnd),
        tap(() => {
          this.loadProduct();
        }),
      )
      .subscribe();
  }

  close() {
    this.router.navigateByUrl('/products');
  }

  loadProduct() {
    this.productService
      .getProductById(this.activatedRoute.snapshot.params['id'])
      .subscribe((product) => {
        this.product$.next(product);
      });
  }
}
