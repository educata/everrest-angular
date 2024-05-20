import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { QR } from '@app-shared/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SweetAlertService } from '@app-shared/services';

@Component({
  selector: 'ec-qr-display',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrDisplayComponent {
  @Input() qr: QR | null = null;

  private readonly sweetAlertService = inject(SweetAlertService);

  download() {
    if (!this.qr) {
      this.sweetAlertService.toast(
        'Provide qr object for download',
        'error',
        'red',
      );
      return;
    }

    const a = document.createElement('a');
    a.href = this.qr?.result;
    a.download = `${this.qr.text.split(' ').join('_')}_generated_image.${this.qr.type}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
