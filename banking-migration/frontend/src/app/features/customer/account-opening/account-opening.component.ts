import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AccountRequestService } from '../../../core/services/account-request.service';

@Component({
  selector: 'app-account-opening',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatCardModule, MatSnackBarModule, MatIconModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-icon class="header-icon">add_circle_outline</mat-icon>
          <mat-card-title>Account Opening</mat-card-title>
          <mat-card-subtitle>Fill in the details below to open a new account</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Branch</mat-label>
                <mat-select formControlName="branch">
                  <mat-option *ngFor="let b of branches" [value]="b">{{b}}</mat-option>
                </mat-select>
                <mat-error>Branch is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Account Type</mat-label>
                <mat-select formControlName="accountType">
                  <mat-option value="Savings">Savings</mat-option>
                  <mat-option value="Current">Current</mat-option>
                </mat-select>
                <mat-error>Account Type is required</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row three-col">
              <mat-form-field appearance="outline">
                <mat-label>Title</mat-label>
                <mat-select formControlName="title">
                  <mat-option *ngFor="let t of titles" [value]="t">{{t}}</mat-option>
                </mat-select>
                <mat-error>Required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName">
                <mat-error>Required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName">
                <mat-error>Required</mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date of Birth</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dob">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error>Date of Birth is required</mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Work Phone</mat-label>
                <input matInput formControlName="workPhone" maxlength="10">
                <mat-error>Must be exactly 10 digits</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Home Phone</mat-label>
                <input matInput formControlName="homePhone" maxlength="10">
                <mat-error>Must be exactly 10 digits</mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Address</mat-label>
              <input matInput formControlName="address">
              <mat-error>Address is required</mat-error>
            </mat-form-field>

            <div class="form-row three-col">
              <mat-form-field appearance="outline">
                <mat-label>State</mat-label>
                <input matInput formControlName="state">
                <mat-error>Required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Zip</mat-label>
                <input matInput formControlName="zip">
                <mat-error>Required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email">
                <mat-error>Valid email ending in .com</mat-error>
              </mat-form-field>
            </div>

            <div class="submit-row">
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || submitting">
                <mat-icon>send</mat-icon>
                {{ submitting ? 'Submitting...' : 'Submit Application' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 720px; margin: 0 auto; padding: 0 20px; }
    .header-icon { color: #3f51b5; font-size: 28px; width: 28px; height: 28px; margin-right: 12px; }
    mat-card-header { margin-bottom: 24px; }
    .full-width { width: 100%; }
    .form-row { display: flex; gap: 16px; }
    .form-row mat-form-field { flex: 1; }
    .three-col mat-form-field { flex: 1; min-width: 0; }
    form { display: flex; flex-direction: column; gap: 2px; }
    .submit-row { display: flex; justify-content: flex-end; margin-top: 16px; }
    .submit-row button mat-icon { margin-right: 8px; }
  `],
})
export class AccountOpeningComponent {
  branches = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];
  titles = ['Mr', 'Mrs', 'Ms', 'Dr'];
  submitting = false;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountRequestService: AccountRequestService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      branch: ['', Validators.required],
      accountType: ['', Validators.required],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      workPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      homePhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[^@]+@[^@]+\.com$/)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    const data = { ...this.form.value };
    if (data.dob instanceof Date) {
      const year = data.dob.getFullYear();
      const month = String(data.dob.getMonth() + 1).padStart(2, '0');
      const day = String(data.dob.getDate()).padStart(2, '0');
      data.dob = `${year}-${month}-${day}`;
    }
    this.accountRequestService.create(data).subscribe({
      next: (res) => {
        this.snackBar.open(`Application submitted! Request ID: ${res.requestId}`, 'Close', { duration: 8000 });
        this.form.reset();
        this.submitting = false;
      },
      error: () => { this.submitting = false; },
    });
  }
}
