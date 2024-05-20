import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QrService, SweetAlertService } from '@app-shared/services';
import { LoadingComponent, QrDisplayComponent } from '@app-shared/ui';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EMPTY, Observable, Subject, map, startWith } from 'rxjs';
import { QR } from '@app-shared/interfaces';

@Component({
  selector: 'ec-qr',
  standalone: true,
  imports: [
    QrDisplayComponent,
    LoadingComponent,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class QrComponent {
  private readonly qrService = inject(QrService);
  private readonly sweetAlertService = inject(SweetAlertService);

  readonly textInput = new FormControl('', [Validators.required]);

  readonly baseQr$ = this.qrService.getBaseQR();
  readonly isTextInputInvalid$ = this.textInput.valueChanges.pipe(
    startWith(''),
    map((value) => value === ''),
  );

  textQrCode$: Observable<QR> = EMPTY;

  generateQrCode() {
    const value = this.textInput.value;

    if (!value) {
      this.sweetAlertService.toast('Text is required', 'error', 'red');
      return;
    }

    this.textInput.reset();
    this.textQrCode$ = this.qrService.genereateQR(value);
  }
}
