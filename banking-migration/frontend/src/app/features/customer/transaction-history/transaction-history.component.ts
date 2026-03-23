import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatCardModule,
    MatTableModule, MatIconModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-icon class="header-icon">history</mat-icon>
          <mat-card-title>Transaction History</mat-card-title>
          <mat-card-subtitle>View transactions within a date range</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="search-form">
            <mat-form-field appearance="outline" class="date-field">
              <mat-label>Start Date</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="startDate">
              <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline" class="date-field">
              <mat-label>End Date</mat-label>
              <input matInput [matDatepicker]="endPicker" formControlName="endDate">
              <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              <mat-icon>search</mat-icon> Search
            </button>
          </form>

          <table mat-table [dataSource]="transactions" class="full-width" *ngIf="transactions.length > 0">
            <ng-container matColumnDef="transactionId">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let t">{{ t.transactionId }}</td>
            </ng-container>
            <ng-container matColumnDef="transactionDate">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let t">{{ t.transactionDate | date:'mediumDate' }}</td>
            </ng-container>
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let t">&#8377; {{ t.amount | number:'1.2-2' }}</td>
            </ng-container>
            <ng-container matColumnDef="chequeNo">
              <th mat-header-cell *matHeaderCellDef>Cheque No</th>
              <td mat-cell *matCellDef="let t">{{ t.chequeNo }}</td>
            </ng-container>
            <ng-container matColumnDef="transactionType">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let t">
                <span class="type-badge" [class.credit]="t.transactionType === 'CR'" [class.debit]="t.transactionType === 'DR'">
                  {{ t.transactionType }}
                </span>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="searched && transactions.length === 0" class="no-data">
            <mat-icon>inbox</mat-icon>
            <p>No transactions found in the selected date range.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 760px; margin: 0 auto; padding: 0 20px; }
    .header-icon { color: #607d8b; font-size: 28px; width: 28px; height: 28px; margin-right: 12px; }
    mat-card-header { margin-bottom: 24px; }
    .full-width { width: 100%; }
    .search-form { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
    .date-field { flex: 1; min-width: 180px; }
    table { margin-top: 24px; }
    .type-badge {
      display: inline-block;
      padding: 2px 12px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.8rem;
    }
    .credit { background: #e8f5e9; color: #2e7d32; }
    .debit { background: #ffebee; color: #c62828; }
    .no-data {
      text-align: center;
      padding: 40px 0;
      color: #999;
    }
    .no-data mat-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }
    .no-data p { margin-top: 8px; }
  `],
})
export class TransactionHistoryComponent {
  form: FormGroup;
  transactions: Transaction[] = [];
  searched = false;
  displayedColumns = ['transactionId', 'transactionDate', 'amount', 'chequeNo', 'transactionType'];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
  ) {
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const startDate = this.formatDate(this.form.value.startDate);
    const endDate = this.formatDate(this.form.value.endDate);
    this.transactionService.getHistory(startDate, endDate).subscribe({
      next: (data) => {
        this.transactions = data;
        this.searched = true;
      },
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
