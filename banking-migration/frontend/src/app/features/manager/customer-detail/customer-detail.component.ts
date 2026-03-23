import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AdminService } from '../../../core/services/admin.service';
import { AccountRequest } from '../../../shared/models/account-request.model';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatIconModule, MatDividerModule],
  template: `
    <div class="container" *ngIf="request">
      <mat-card>
        <mat-card-header>
          <mat-icon class="header-icon">person</mat-icon>
          <mat-card-title>Customer Detail - Request #{{ request.requestId }}</mat-card-title>
          <mat-card-subtitle>Full application details</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Branch</span>
              <span class="detail-value">{{ request.branch }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Account Type</span>
              <span class="detail-value">{{ request.accountType }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Title</span>
              <span class="detail-value">{{ request.title }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Name</span>
              <span class="detail-value">{{ request.firstName }} {{ request.lastName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Date of Birth</span>
              <span class="detail-value">{{ request.dob }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Work Phone</span>
              <span class="detail-value">{{ request.workPhone }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Home Phone</span>
              <span class="detail-value">{{ request.homePhone }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Address</span>
              <span class="detail-value">{{ request.address }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">State</span>
              <span class="detail-value">{{ request.state }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Zip</span>
              <span class="detail-value">{{ request.zip }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email</span>
              <span class="detail-value">{{ request.email }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Status</span>
              <span class="detail-value status-badge" [ngClass]="request?.status?.toLowerCase() || ''">{{ request.status }}</span>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-stroked-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon> Back to Approvals
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 680px; margin: 0 auto; padding: 0 20px; }
    .header-icon { color: #3f51b5; font-size: 28px; width: 28px; height: 28px; margin-right: 12px; }
    mat-card-header { margin-bottom: 24px; }
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .detail-label {
      font-size: 0.8rem;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }
    .detail-value {
      font-size: 1rem;
      color: #333;
      font-weight: 500;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 14px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      width: fit-content;
    }
    .entered { background: #fff8e1; color: #f57c00; }
    .approved { background: #e8f5e9; color: #2e7d32; }
    .rejected { background: #ffebee; color: #c62828; }
    mat-card-actions { padding: 16px 0 0; }
    mat-card-actions button mat-icon { margin-right: 8px; }
  `],
})
export class CustomerDetailComponent implements OnInit {
  request: AccountRequest | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    const requestId = Number(this.route.snapshot.paramMap.get('requestId'));
    this.adminService.getRequest(requestId).subscribe({
      next: (data) => { this.request = data; },
    });
  }

  goBack(): void {
    this.router.navigate(['/manager/approvals']);
  }
}
