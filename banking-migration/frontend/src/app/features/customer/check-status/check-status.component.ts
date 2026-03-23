import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AccountRequestService } from '../../../core/services/account-request.service';
import { AccountRequestStatus } from '../../../shared/models/account-request.model';

@Component({
  selector: 'app-check-status',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatIconModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-icon class="header-icon">search</mat-icon>
          <mat-card-title>Check Application Status</mat-card-title>
          <mat-card-subtitle>Enter your Request ID to view the current status</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="search-form">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Request ID</mat-label>
              <input matInput formControlName="requestId" type="number">
              <mat-error>Request ID is required</mat-error>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              <mat-icon>search</mat-icon> Check Status
            </button>
          </form>

          <div *ngIf="result" class="result-card" [ngClass]="result.status.toLowerCase()">
            <mat-icon class="status-icon" *ngIf="result.status === 'ENTERED'">hourglass_empty</mat-icon>
            <mat-icon class="status-icon" *ngIf="result.status === 'APPROVED'">check_circle</mat-icon>
            <mat-icon class="status-icon" *ngIf="result.status === 'REJECTED'">cancel</mat-icon>

            <h3>Status: {{ result.status }}</h3>
            <p *ngIf="result.status === 'ENTERED'">Your application is pending review by a manager.</p>
            <p *ngIf="result.status === 'APPROVED'">
              Congratulations! Your account has been approved.<br>
              <strong class="account-number">Account Number: {{ result.accountNumber }}</strong>
            </p>
            <p *ngIf="result.status === 'REJECTED'">Your application has been rejected. Please contact the bank.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 560px; margin: 0 auto; padding: 0 20px; }
    .header-icon { color: #ff9800; font-size: 28px; width: 28px; height: 28px; margin-right: 12px; }
    mat-card-header { margin-bottom: 24px; }
    .search-form { display: flex; gap: 16px; align-items: flex-start; }
    .search-field { flex: 1; }
    .result-card {
      margin-top: 24px;
      padding: 28px;
      border-radius: 12px;
      text-align: center;
      border-left: 4px solid;
    }
    .status-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; }
    .entered { background: #fff8e1; border-left-color: #ff9800; }
    .entered .status-icon { color: #f57c00; }
    .approved { background: #e8f5e9; border-left-color: #4caf50; }
    .approved .status-icon { color: #388e3c; }
    .rejected { background: #ffebee; border-left-color: #f44336; }
    .rejected .status-icon { color: #d32f2f; }
    .result-card h3 { margin: 8px 0; font-size: 1.25rem; }
    .result-card p { margin: 8px 0 0; color: #555; }
    .account-number { color: #2e7d32; font-size: 1.1rem; }
  `],
})
export class CheckStatusComponent {
  form: FormGroup;
  result: AccountRequestStatus | null = null;

  constructor(
    private fb: FormBuilder,
    private accountRequestService: AccountRequestService,
  ) {
    this.form = this.fb.group({
      requestId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.result = null;
    this.accountRequestService.getStatus(this.form.value.requestId).subscribe({
      next: (res) => { this.result = res; },
    });
  }
}
