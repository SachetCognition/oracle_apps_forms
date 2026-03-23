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
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatCardModule,
    MatTableModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header><mat-card-title>Transaction History</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="date-row">
              <mat-form-field appearance="outline">
                <mat-label>Start Date</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>End Date</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              Search
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
              <td mat-cell *matCellDef="let t">{{ t.amount | number:'1.2-2' }}</td>
            </ng-container>
            <ng-container matColumnDef="chequeNo">
              <th mat-header-cell *matHeaderCellDef>Cheque No</th>
              <td mat-cell *matCellDef="let t">{{ t.chequeNo }}</td>
            </ng-container>
            <ng-container matColumnDef="transactionType">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let t">{{ t.transactionType }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <p *ngIf="searched && transactions.length === 0" class="no-data">No transactions found in the selected date range.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 700px; margin: 40px auto; padding: 0 20px; }
    .full-width { width: 100%; }
    .date-row { display: flex; gap: 16px; }
    .date-row mat-form-field { flex: 1; }
    table { margin-top: 24px; }
    .no-data { text-align: center; color: #666; margin-top: 24px; }
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
