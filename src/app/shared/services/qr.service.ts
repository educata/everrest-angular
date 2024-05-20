import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@app-shared/consts';
import { QR } from '@app-shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  private readonly http = inject(HttpClient);

  readonly baseUrl = `${API_URL}/qrcode`;

  getBaseQR() {
    return this.http.get<QR>(`${this.baseUrl}`);
  }

  genereateQR(text: string) {
    return this.http.post<QR>(`${this.baseUrl}/generate`, { text });
  }

  genereateQRWithImage(text: string, imageURL: string) {
    return this.http.post<Required<QR>>(`${this.baseUrl}/generate_with_image`, {
      text,
      imageURL,
    });
  }
}
