import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StorageKeys } from '@app-shared/enums';
import { Product, Products } from '@app-shared/interfaces';
import { ProductService } from '@app-shared/services';
import { LoadingComponent, ProductCardComponent } from '@app-shared/ui';
import { BehaviorSubject, filter, map, skip, take, tap } from 'rxjs';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'ec-products',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatPaginatorModule,
    MatButtonToggleModule,
    LoadingComponent,
    ProductCardComponent,
    NgClass,
    AsyncPipe,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  readonly #products$ = new BehaviorSubject<Products | null>(null);
  readonly products$ = this.#products$.asObservable();

  readonly firstLoad$ = this.products$.pipe(skip(1), take(1));

  readonly splitScreen$ = this.router.events.pipe(
    takeUntilDestroyed(),
    filter((event) => event instanceof NavigationEnd),
    map(() => {
      let root = this.activatedRoute.snapshot;
      while (root.firstChild) {
        root = root.firstChild;
      }
      return Boolean(root.params['id']);
    }),
  );

  readonly productBrands$ = this.productService.getProductBrands();

  readonly cache = new Map<number, Product[]>();

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
    const productsCache = sessionStorage.getItem(StorageKeys.Products);

    if (productsCache) {
      const result = new Map<number, Product[]>(JSON.parse(productsCache));
      result.forEach((item, index) => {
        this.cache.set(index, item);
      });
    }

    this.loadProducts(1);

    this.firstLoad$
      .pipe(
        takeUntilDestroyed(),
        tap((response) => {
          if (response) {
            this.conifg.total = response.total;
            this.conifg.limit = response.limit;
          }
        }),
      )
      .subscribe();
  }

  loadProducts(index: number) {
    const cachedProducts = this.cache.get(index);

    if (cachedProducts && this.products) {
      const prevProducts = this.products;
      this.products = {
        ...prevProducts,
        products: cachedProducts,
      };

      return;
    }

    this.productService
      .getAllProducts(index)
      .pipe(
        tap((response) => {
          this.products = response;
          this.cache.set(response.page, response.products);
          sessionStorage.setItem(
            StorageKeys.Products,
            JSON.stringify([...this.cache]),
          );
        }),
      )
      .subscribe();
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
