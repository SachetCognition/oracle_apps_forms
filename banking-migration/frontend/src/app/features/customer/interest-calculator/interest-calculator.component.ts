import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
    MatSelectModule, MatButtonModule, MatCardModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header><mat-card-title>Interest Calculator</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="calculate()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Loan Type</mat-label>
              <mat-select formControlName="loanType" (selectionChange)="onLoanTypeChange()">
                <mat-option *ngFor="let type of loanTypes" [value]="type">{{ type }}</mat-option>
              </mat-select>
              <mat-error>Loan Type is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width" *ngIf="selectedConfig">
              <mat-label>Interest Rate (%)</mat-label>
              <input matInput [value]="selectedConfig.rate" disabled>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Principal Amount</mat-label>
              <input matInput type="number" formControlName="principal">
              <mat-error *ngIf="form.get('principal')?.hasError('required')">Principal is required</mat-error>
              <mat-error *ngIf="form.get('principal')?.hasError('min')">
                Minimum: {{ selectedConfig?.min | number }}
              </mat-error>
              <mat-error *ngIf="form.get('principal')?.hasError('max')">
                Maximum: {{ selectedConfig?.max | number }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Time (years)</mat-label>
              <input matInput type="number" formControlName="time">
              <mat-error>Time is required and must be positive</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              Calculate Interest
            </button>
          </form>

          <div *ngIf="result !== null" class="result-card">
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
    .form-container { max-width: 500px; margin: 40px auto; padding: 0 20px; }
    .full-width { width: 100%; }
    form { display: flex; flex-direction: column; gap: 4px; }
    .result-card { margin-top: 24px; padding: 24px; background: #e8f5e9; border-radius: 8px; text-align: center; }
    .result-value { font-size: 2rem; font-weight: bold; color: #2e7d32; }
    .result-details { color: #666; }
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
