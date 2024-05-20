import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxCubeLoaderComponent } from 'ngx-cube-loader';

@Component({
  selector: 'ec-loading',
  standalone: true,
  imports: [NgxCubeLoaderComponent],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {}
