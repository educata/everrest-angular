import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuthService, SweetAlertService } from '@app-shared/services';
import { SignUpUser } from '@app-shared/interfaces';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'ec-auth',
  standalone: true,
  imports: [
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(SweetAlertService);

  currentIndex = 0;

  readonly signIn = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  readonly signUp = this.fb.group({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(22),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(22),
    ]),
    age: new FormControl(19, [Validators.required, Validators.min(18)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(22),
    ]),
    address: new FormControl('', Validators.required),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/\+9955\d{8}$/),
    ]),
    zipcode: new FormControl('', Validators.required),
    gender: new FormControl('MALE', Validators.required),
  });

  getSignInFormError(control: string) {
    return (this.signIn.get(control) || {}).errors || {};
  }

  getSignUpFormError(control: string) {
    return (this.signUp.get(control) || {}).errors || {};
  }

  onSignInSubmit() {
    const { email, password } = this.signIn.value;

    if (!email || !password) {
      this.alertService.toast('Fill all inputs', 'error', 'red');
      return;
    }

    this.authService
      .signIn({ email, password })
      .pipe(
        tap((response) => {
          this.alertService.toast(
            'Successfully authorized',
            'success',
            'green',
          );
          this.authService.handleTokens(response);
        }),
        catchError((err) => {
          this.alertService.error(err);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  onSignUpSubmit() {
    const user = this.signUp.value as SignUpUser;

    user.avatar = `https://api.dicebear.com/8.x/pixel-art-neutral/svg?seed=${user.firstName}`;

    this.authService
      .signUp(user)
      .pipe(
        tap(() => {
          this.alertService.toast(
            'Successfully registered',
            'success',
            'green',
          );
          this.tabChange(0);
        }),
        catchError((err) => {
          this.alertService.error(err.error);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  tabChange(index: number) {
    this.currentIndex = index;
    this.signIn.reset();
    this.signUp.reset({
      age: 1,
      gender: 'MALE',
      phone: '+9955',
    });
  }
}
