import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ec-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {}
