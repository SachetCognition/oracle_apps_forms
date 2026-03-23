import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatIconModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-icon class="header-icon">login</mat-icon>
          <mat-card-title>Customer Login</mat-card-title>
          <mat-card-subtitle>Sign in to access your account</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Account Number</mat-label>
              <input matInput formControlName="accountNumber">
              <mat-error>Account Number is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error>Password is required</mat-error>
            </mat-form-field>

            <div class="submit-row">
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || submitting">
                <mat-icon>login</mat-icon>
                {{ submitting ? 'Logging in...' : 'Login' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 460px; margin: 0 auto; padding: 0 20px; }
    .header-icon { color: #00bcd4; font-size: 28px; width: 28px; height: 28px; margin-right: 12px; }
    mat-card-header { margin-bottom: 24px; }
    .full-width { width: 100%; }
    form { display: flex; flex-direction: column; gap: 2px; }
    .submit-row { display: flex; justify-content: flex-end; margin-top: 16px; }
    .submit-row button mat-icon { margin-right: 8px; }
  `],
})
export class CustomerLoginComponent {
  hidePassword = true;
  submitting = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      accountNumber: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.authService.customerLogin(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/customer/dashboard']);
      },
      error: () => { this.submitting = false; },
    });
  }
}
