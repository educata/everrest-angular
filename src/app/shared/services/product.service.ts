import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_PAGINATION_CONFIG, API_URL } from '@app-shared/consts';
import { PaginationService } from './pagination.service';
import { Product, Products } from '@app-shared/interfaces';
import { EMPTY, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { SweetAlertService } from './sweet-alert2.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sweetAletService = inject(SweetAlertService);
  private readonly paginationService = inject(PaginationService);

  readonly baseUrl = `${API_URL}/shop/products`;

  getAllProducts(
    pageIndex = API_PAGINATION_CONFIG.PAGE_INDEX,
    pageSize = API_PAGINATION_CONFIG.PAGE_SIZE,
  ) {
    return this.http.get<Products>(
      `${this.baseUrl}/all?${this.paginationService.getPaginationString(pageIndex, pageSize)}`,
    );
  }

  getProductById(id: string) {
    return this.http.get<Product>(`${this.baseUrl}/id/${id}`).pipe(
      catchError(() => {
        this.sweetAletService.toast('Product not found', 'error', 'red');
        this.router.navigateByUrl('/products');
        return EMPTY;
      }),
    );
  }
}
