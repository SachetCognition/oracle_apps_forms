import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { AccountRequest } from '../../../shared/models/account-request.model';

@Component({
  selector: 'app-manager-approval',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatCardModule,
    MatIconModule, MatSnackBarModule, MatChipsModule, MatTooltipModule,
  ],
  template: `
    <div class="container">
      <div class="header-row">
        <div>
          <h2>Pending Account Requests</h2>
          <p class="header-subtitle">Review, approve or reject customer applications</p>
        </div>
        <button mat-stroked-button color="warn" (click)="logout()">
          <mat-icon>logout</mat-icon> Logout
        </button>
      </div>
      <mat-card>
        <table mat-table [dataSource]="requests" class="full-width" *ngIf="requests.length > 0">
          <ng-container matColumnDef="requestId">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let r">{{ r.requestId }}</td>
          </ng-container>
          <ng-container matColumnDef="branch">
            <th mat-header-cell *matHeaderCellDef>Branch</th>
            <td mat-cell *matCellDef="let r">{{ r.branch }}</td>
          </ng-container>
          <ng-container matColumnDef="accountType">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let r">
              <span class="type-badge">{{ r.accountType }}</span>
            </td>
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
            <td mat-cell *matCellDef="let r">
              <span class="status-badge entered">{{ r.status }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let r">
              <button mat-mini-fab color="primary" (click)="approve(r.requestId)" matTooltip="Approve">
                <mat-icon>check</mat-icon>
              </button>
              <button mat-mini-fab color="warn" (click)="reject(r.requestId)" matTooltip="Reject" class="ml-8">
                <mat-icon>close</mat-icon>
              </button>
              <button mat-mini-fab (click)="viewDetails(r.requestId)" matTooltip="View Details" class="ml-8">
                <mat-icon>info</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <div *ngIf="requests.length === 0" class="no-data">
          <mat-icon>check_circle_outline</mat-icon>
          <p>No pending requests. All caught up!</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 960px; margin: 0 auto; padding: 0 20px; }
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    h2 { margin: 0; font-size: 1.6rem; font-weight: 700; color: #1a237e; }
    .header-subtitle { color: #666; margin: 4px 0 0; }
    .full-width { width: 100%; }
    .ml-8 { margin-left: 8px; }
    .type-badge {
      display: inline-block;
      padding: 2px 12px;
      border-radius: 12px;
      background: #e3f2fd;
      color: #1565c0;
      font-weight: 500;
      font-size: 0.8rem;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 12px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.8rem;
    }
    .entered { background: #fff8e1; color: #f57c00; }
    .no-data {
      text-align: center;
      padding: 48px 0;
      color: #999;
    }
    .no-data mat-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }
    .no-data p { margin-top: 8px; }
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
