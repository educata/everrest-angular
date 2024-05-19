import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_PAGINATION_CONFIG, API_URL } from '@app-shared/consts';
import { Quote, Quotes } from '@app-shared/interfaces';
import { PaginationService } from './pagination.service';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private readonly http = inject(HttpClient);
  private readonly paginationService = inject(PaginationService);

  readonly baseUrl = `${API_URL}/quote`;

  getQuotes(
    pageIndex = API_PAGINATION_CONFIG.PAGE_INDEX,
    pageSize = API_PAGINATION_CONFIG.PAGE_SIZE,
  ) {
    return this.http.get<Quotes>(
      `${this.baseUrl}?${this.paginationService.getPaginationString(pageIndex, pageSize)}`,
    );
  }

  getRandomQuote() {
    return this.http.get<Quote>(`${this.baseUrl}/random`);
  }
}
