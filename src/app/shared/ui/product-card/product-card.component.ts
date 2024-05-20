import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Product } from '@app-shared/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TextShorterPipe } from '@app-shared/pipes';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app-shared/services';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ec-product-card',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    TextShorterPipe,
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product: Product | null = null;
  @Input() standaloneView = false;

  private readonly auth = inject(AuthService);

  readonly user$ = this.auth.user$;
}
