import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@app-shared/services';

@Component({
  selector: 'ec-verify',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class VerifyComponent {
  private readonly authService = inject(AuthService);

  logOut() {
    this.authService.logOut();
  }
}
