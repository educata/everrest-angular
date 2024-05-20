import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TITLE, TITLE_SEPARATOR } from '@app-shared/consts';
import { Product, Products } from '@app-shared/interfaces';
import { ProductService } from '@app-shared/services';
import { LoadingComponent, ProductCardComponent } from '@app-shared/ui';
import { BehaviorSubject, filter, skip, take, tap } from 'rxjs';

@Component({
  selector: 'ec-product-brand',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatPaginatorModule,
    MatButtonToggleModule,
    LoadingComponent,
    ProductCardComponent,
  ],
  templateUrl: './product-brand.component.html',
  styleUrl: './product-brand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductBrandComponent {
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  readonly productBrands$ = this.productService.getProductBrands();
  readonly currentBrand = new FormControl(
    this.activatedRoute.snapshot.params['brand'] || '',
  );

  readonly #products$ = new BehaviorSubject<Products | null>(null);
  readonly products$ = this.#products$.asObservable();

  readonly conifg = {
    limit: 5,
    total: 1,
  };

  get products() {
    return this.#products$.value;
  }

  set products(products: Products | null) {
    this.#products$.next(products);
  }

  constructor() {
    this.loadProducts(this.currentBrand.value, 1);

    this.activatedRoute.params
      .pipe(
        takeUntilDestroyed(),
        tap((params) => {
          this.loadProducts(params['brand'], 1);
        }),
      )
      .subscribe();
  }

  loadProducts(brand: string, index: number) {
    this.productService
      .getProductsByBrands(brand, index)
      .pipe(
        tap((response) => {
          this.products = response;
          this.title.setTitle(
            `${TITLE} ${TITLE_SEPARATOR} Products ${TITLE_SEPARATOR} ${brand}`,
          );
        }),
      )
      .subscribe();
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
