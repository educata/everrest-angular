import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { QuoteService } from '@app-shared/services';
import { BehaviorSubject, skip, take, tap } from 'rxjs';
import { Quote, Quotes } from '@app-shared/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { LoadingComponent } from '@app-shared/ui';
import { StorageKeys } from '@app-shared/enums';

@Component({
  selector: 'ec-quote',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    LoadingComponent,
    AsyncPipe,
  ],
  templateUrl: './quote.component.html',
  styleUrl: './quote.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class QuoteComponent {
  private readonly quoteService = inject(QuoteService);

  randomQuote$ = this.quoteService.getRandomQuote();
  readonly #quotes$ = new BehaviorSubject<Quotes | null>(null);
  readonly quotes$ = this.#quotes$.asObservable();

  readonly cache = new Map<number, Quote[]>();

  get quotes() {
    return this.#quotes$.value;
  }

  set quotes(quotes: Quotes | null) {
    this.#quotes$.next(quotes);
  }

  readonly firstLoad$ = this.quotes$.pipe(skip(1), take(1));

  readonly displayedColumns: string[] = [
    'id',
    'type',
    'author',
    'quote',
    'search',
  ];

  readonly conifg = {
    limit: 5,
    total: 1,
  };

  constructor() {
    const quotesCache = localStorage.getItem(StorageKeys.Quotes);

    if (quotesCache) {
      const result = new Map<number, Quote[]>(JSON.parse(quotesCache));
      result.forEach((item, index) => {
        this.cache.set(index, item);
      });
    }

    this.loadQuote(1);

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

  loadQuote(index: number) {
    const cachedQuotes = this.cache.get(index);

    if (cachedQuotes && this.quotes) {
      const prevQuote = this.quotes;
      this.quotes = {
        ...prevQuote,
        quotes: cachedQuotes,
      };

      return;
    }

    this.quoteService
      .getQuotes(index)
      .pipe(
        tap((response) => {
          this.quotes = response;
          this.cache.set(response.page, response.quotes);
          localStorage.setItem(
            StorageKeys.Quotes,
            JSON.stringify([...this.cache]),
          );
        }),
      )
      .subscribe();
  }

  encodeUrl(quote: Quote) {
    return encodeURI(`${quote.author} ${quote.quote}`);
  }

  updateRandomQuote() {
    this.randomQuote$ = this.quoteService.getRandomQuote();
  }
}
