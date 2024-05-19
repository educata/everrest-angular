import { Injectable } from '@angular/core';
import { API_PAGINATION_CONFIG } from '@app-shared/consts';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  getPaginationString(
    pageIndex = API_PAGINATION_CONFIG.PAGE_INDEX,
    pageSize = API_PAGINATION_CONFIG.PAGE_SIZE,
  ) {
    return `page_index=${pageIndex}&page_size=${pageSize}`;
  }
}
