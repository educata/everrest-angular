import { Pagination } from './pagination';

export interface Quote {
  _id: string;
  author: string;
  quote: string;
  type: string;
}

export interface Quotes extends Pagination {
  quotes: Quote[];
}
