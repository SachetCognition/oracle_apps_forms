import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { AccountRequest } from '../../../shared/models/account-request.model';

@Component({
  selector: 'app-manager-approval',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatCardModule,
    MatIconModule, MatSnackBarModule,
  ],
  template: `
    <div class="container">
      <div class="header-row">
        <h2>Pending Account Requests</h2>
        <button mat-stroked-button (click)="logout()">
          <mat-icon>logout</mat-icon> Logout
        </button>
      </div>
      <mat-card>
        <table mat-table [dataSource]="requests" class="full-width" *ngIf="requests.length > 0">
          <ng-container matColumnDef="requestId">
            <th mat-header-cell *matHeaderCellDef>Request ID</th>
            <td mat-cell *matCellDef="let r">{{ r.requestId }}</td>
          </ng-container>
          <ng-container matColumnDef="branch">
            <th mat-header-cell *matHeaderCellDef>Branch</th>
            <td mat-cell *matCellDef="let r">{{ r.branch }}</td>
          </ng-container>
          <ng-container matColumnDef="accountType">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let r">{{ r.accountType }}</td>
          </ng-container>
          <ng-container matColumnDef="firstName">
            <th mat-header-cell *matHeaderCellDef>First Name</th>
            <td mat-cell *matCellDef="let r">{{ r.firstName }}</td>
          </ng-container>
          <ng-container matColumnDef="lastName">
            <th mat-header-cell *matHeaderCellDef>Last Name</th>
            <td mat-cell *matCellDef="let r">{{ r.lastName }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let r">{{ r.status }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let r">
              <button mat-mini-fab color="primary" (click)="approve(r.requestId)" title="Approve">
                <mat-icon>check</mat-icon>
              </button>
              <button mat-mini-fab color="warn" (click)="reject(r.requestId)" title="Reject" class="ml-8">
                <mat-icon>close</mat-icon>
              </button>
              <button mat-mini-fab (click)="viewDetails(r.requestId)" title="Details" class="ml-8">
                <mat-icon>info</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <p *ngIf="requests.length === 0" class="no-data">No pending requests.</p>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 40px auto; padding: 0 20px; }
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .full-width { width: 100%; }
    .ml-8 { margin-left: 8px; }
    .no-data { text-align: center; padding: 40px; color: #666; }
  `],
})
export class ManagerApprovalComponent implements OnInit {
  requests: AccountRequest[] = [];
  displayedColumns = ['requestId', 'branch', 'accountType', 'firstName', 'lastName', 'status', 'actions'];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.adminService.getPendingRequests().subscribe({
      next: (data) => { this.requests = data; },
    });
  }

  approve(requestId: number): void {
    this.adminService.approve(requestId).subscribe({
      next: (res) => {
        this.snackBar.open(`Approved! Account Number: ${res.accountNumber}`, 'Close', { duration: 8000 });
        this.loadRequests();
      },
    });
  }

  reject(requestId: number): void {
    this.adminService.reject(requestId).subscribe({
      next: () => {
        this.snackBar.open('Request rejected', 'Close', { duration: 5000 });
        this.loadRequests();
      },
    });
  }

  viewDetails(requestId: number): void {
    this.router.navigate(['/manager/customer', requestId]);
  }

  logout(): void {
    this.authService.logout();
  }
}
