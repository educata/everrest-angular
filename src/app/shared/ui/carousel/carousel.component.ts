import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ec-carousel',
  standalone: true,
  imports: [MatIconModule, AsyncPipe],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnChanges {
  @Input() imageSources: string[] = [];

  readonly #images$ = new BehaviorSubject<string[]>([]);
  readonly images$ = this.#images$.asObservable();

  readonly #currentImage$ = new BehaviorSubject<{
    index: number;
    image: string;
  } | null>(null);
  readonly currentImage$ = this.#currentImage$.asObservable();

  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      if (change === 'imageSources') {
        this.#images$.next(changes[change].currentValue);
        this.#currentImage$.next({
          index: 0,
          image: this.#images$.value[0],
        });
      }
    }
  }

  load(dir: number) {
    if (!this.#currentImage$.value) {
      return;
    }

    let nextIndex = this.#currentImage$.value.index + dir;

    if (nextIndex > this.#images$.value.length - 1) {
      nextIndex = 0;
    }

    if (nextIndex === -1) {
      nextIndex = this.#images$.value.length - 1;
    }

    this.#currentImage$.next({
      index: nextIndex,
      image: this.#images$.value[nextIndex],
    });
  }
}
