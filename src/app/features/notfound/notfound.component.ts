import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'ec-notfound',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotfoundComponent {}
