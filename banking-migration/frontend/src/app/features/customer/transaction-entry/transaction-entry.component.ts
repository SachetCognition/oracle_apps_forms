import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-transaction-entry',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatCardModule, MatIconModule, MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-icon class="header-icon">payment</mat-icon>
          <mat-card-title>Transaction Entry</mat-card-title>
          <mat-card-subtitle>Record a new credit or debit transaction</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Transaction Type</mat-label>
              <mat-select formControlName="transactionType">
                <mat-option value="CR">Credit (CR)</mat-option>
                <mat-option value="DR">Debit (DR)</mat-option>
              </mat-select>
              <mat-error>Transaction Type is required</mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Amount</mat-label>
                <input matInput type="number" formControlName="amount">
                <mat-error *ngIf="form.get('amount')?.hasError('required')">Required</mat-error>
                <mat-error *ngIf="form.get('amount')?.hasError('min')">Min: 1</mat-error>
                <mat-error *ngIf="form.get('amount')?.hasError('max')">Max: 9,999,999</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Cheque Number</mat-label>
                <input matInput formControlName="chequeNo" maxlength="6">
                <mat-error>Must be exactly 6 digits</mat-error>
              </mat-form-field>
            </div>

            <div class="button-row">
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || submitting">
                <mat-icon>send</mat-icon>
                {{ submitting ? 'Submitting...' : 'Submit Transaction' }}
              </button>
              <button mat-stroked-button color="primary" type="button" (click)="viewHistory()">
                <mat-icon>history</mat-icon> View History
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 540px; margin: 0 auto; padding: 0 20px; }
    .header-icon { color: #e91e63; font-size: 28px; width: 28px; height: 28px; margin-right: 12px; }
    mat-card-header { margin-bottom: 24px; }
    .full-width { width: 100%; }
    .form-row { display: flex; gap: 16px; }
    .form-row mat-form-field { flex: 1; }
    form { display: flex; flex-direction: column; gap: 2px; }
    .button-row { display: flex; gap: 12px; margin-top: 16px; justify-content: flex-end; }
    .button-row button mat-icon { margin-right: 8px; }
  `],
})
export class TransactionEntryComponent {
  submitting = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.form = this.fb.group({
      transactionType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1), Validators.max(9999999)]],
      chequeNo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.transactionService.create(this.form.value).subscribe({
      next: (res) => {
        this.snackBar.open(`Transaction created! ID: ${res.transactionId}`, 'Close', { duration: 5000 });
        this.form.reset();
        this.submitting = false;
      },
      error: () => { this.submitting = false; },
    });
  }

  viewHistory(): void {
    this.router.navigate(['/customer/transactions/history']);
  }
}
