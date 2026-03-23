import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface LoanConfig {
  rate: number;
  min: number;
  max: number;
}

@Component({
  selector: 'app-interest-calculator',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatCardModule, MatIconModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-icon class="header-icon">calculate</mat-icon>
          <mat-card-title>Interest Calculator</mat-card-title>
          <mat-card-subtitle>Calculate loan interest for different loan types</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="calculate()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Loan Type</mat-label>
              <mat-select formControlName="loanType" (selectionChange)="onLoanTypeChange()">
                <mat-option *ngFor="let type of loanTypes" [value]="type">{{ type }}</mat-option>
              </mat-select>
              <mat-error>Loan Type is required</mat-error>
            </mat-form-field>

            <div class="info-row" *ngIf="selectedConfig">
              <div class="info-chip">
                <mat-icon>percent</mat-icon>
                <span>Rate: {{ selectedConfig.rate }}%</span>
              </div>
              <div class="info-chip">
                <mat-icon>arrow_downward</mat-icon>
                <span>Min: &#8377;{{ selectedConfig.min | number }}</span>
              </div>
              <div class="info-chip">
                <mat-icon>arrow_upward</mat-icon>
                <span>Max: &#8377;{{ selectedConfig.max | number }}</span>
              </div>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Principal Amount</mat-label>
                <input matInput type="number" formControlName="principal">
                <mat-error *ngIf="form.get('principal')?.hasError('required')">Required</mat-error>
                <mat-error *ngIf="form.get('principal')?.hasError('min')">
                  Min: {{ selectedConfig?.min | number }}
                </mat-error>
                <mat-error *ngIf="form.get('principal')?.hasError('max')">
                  Max: {{ selectedConfig?.max | number }}
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Time (years)</mat-label>
                <input matInput type="number" formControlName="time">
                <mat-error>Required, must be positive</mat-error>
              </mat-form-field>
            </div>

            <div class="submit-row">
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
                <mat-icon>calculate</mat-icon> Calculate Interest
              </button>
            </div>
          </form>

          <div *ngIf="result !== null" class="result-card">
            <mat-icon class="result-icon">savings</mat-icon>
            <h3>Calculated Interest</h3>
            <p class="result-value">&#8377; {{ result | number:'1.2-2' }}</p>
            <p class="result-details">
              Principal: &#8377;{{ form.get('principal')?.value | number }} |
              Rate: {{ selectedConfig?.rate }}% |
              Time: {{ form.get('time')?.value }} years
            </p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 580px; margin: 0 auto; padding: 0 20px; }
    .header-icon { color: #9c27b0; font-size: 28px; width: 28px; height: 28px; margin-right: 12px; }
    mat-card-header { margin-bottom: 24px; }
    .full-width { width: 100%; }
    .form-row { display: flex; gap: 16px; }
    .form-row mat-form-field { flex: 1; }
    form { display: flex; flex-direction: column; gap: 2px; }
    .info-row {
      display: flex; gap: 12px; flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .info-chip {
      display: flex; align-items: center; gap: 4px;
      background: #f3e5f5; color: #7b1fa2;
      padding: 6px 14px; border-radius: 20px;
      font-size: 0.85rem; font-weight: 500;
    }
    .info-chip mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .submit-row { display: flex; justify-content: flex-end; margin-top: 16px; }
    .submit-row button mat-icon { margin-right: 8px; }
    .result-card {
      margin-top: 28px; padding: 28px;
      background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
      border-radius: 12px; text-align: center;
    }
    .result-icon { font-size: 40px; width: 40px; height: 40px; color: #2e7d32; margin-bottom: 8px; }
    .result-value { font-size: 2.2rem; font-weight: 700; color: #1b5e20; margin: 8px 0; }
    .result-details { color: #555; font-size: 0.9rem; }
    .result-card h3 { margin: 0; color: #2e7d32; }
  `],
})
export class InterestCalculatorComponent {
  loanTypes = [
    'HOME LOAN', 'EDUCATION LOAN', 'AGRICULTURE LOAN', 'TWO WHEELER LOAN',
    'FOUR WHEELER LOAN', 'GOLD LOAN', 'PERSONAL LOAN',
  ];

  loanConfigs: Record<string, LoanConfig> = {
    'HOME LOAN': { rate: 8, min: 100000, max: 100000000 },
    'EDUCATION LOAN': { rate: 6, min: 25000, max: 2500000 },
    'AGRICULTURE LOAN': { rate: 6, min: 20000, max: 3000000 },
    'TWO WHEELER LOAN': { rate: 11, min: 20000, max: 300000 },
    'FOUR WHEELER LOAN': { rate: 12, min: 100000, max: 3000000 },
    'GOLD LOAN': { rate: 10, min: 50000, max: 2500000 },
    'PERSONAL LOAN': { rate: 11, min: 100000, max: 2000000 },
  };

  selectedConfig: LoanConfig | null = null;
  result: number | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      loanType: ['', Validators.required],
      principal: ['', [Validators.required, Validators.min(1)]],
      time: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onLoanTypeChange(): void {
    const type = this.form.get('loanType')?.value;
    this.selectedConfig = this.loanConfigs[type] || null;
    this.result = null;
    if (this.selectedConfig) {
      this.form.get('principal')?.setValidators([
        Validators.required,
        Validators.min(this.selectedConfig.min),
        Validators.max(this.selectedConfig.max),
      ]);
      this.form.get('principal')?.updateValueAndValidity();
    }
  }

  calculate(): void {
    if (this.form.invalid || !this.selectedConfig) return;
    const principal = this.form.get('principal')?.value;
    const time = this.form.get('time')?.value;
    this.result = (principal * this.selectedConfig.rate * time) / 100;
  }
}
