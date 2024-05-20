import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingComponent } from '@app-shared/ui';

@Component({
  selector: 'ec-notfound',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotfoundComponent {}
