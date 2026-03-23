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
        <mat-card-header><mat-card-title>Check Application Status</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Request ID</mat-label>
              <input matInput formControlName="requestId" type="number">
              <mat-error>Request ID is required</mat-error>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Check Status</button>
          </form>

          <div *ngIf="result" class="result-card" [ngClass]="result.status.toLowerCase()">
            <mat-icon *ngIf="result.status === 'ENTERED'">hourglass_empty</mat-icon>
            <mat-icon *ngIf="result.status === 'APPROVED'">check_circle</mat-icon>
            <mat-icon *ngIf="result.status === 'REJECTED'">cancel</mat-icon>

            <h3>Status: {{ result.status }}</h3>
            <p *ngIf="result.status === 'ENTERED'">Your application is pending review.</p>
            <p *ngIf="result.status === 'APPROVED'">
              Congratulations! Your account has been approved.<br>
              <strong>Account Number: {{ result.accountNumber }}</strong>
            </p>
            <p *ngIf="result.status === 'REJECTED'">Your application has been rejected. Please contact the bank.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 500px; margin: 40px auto; padding: 0 20px; }
    .full-width { width: 100%; }
    .result-card { margin-top: 24px; padding: 20px; border-radius: 8px; text-align: center; }
    .entered { background: #fff3e0; }
    .approved { background: #e8f5e9; }
    .rejected { background: #ffebee; }
    mat-icon { font-size: 48px; width: 48px; height: 48px; }
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
