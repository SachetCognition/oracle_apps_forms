import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../../core/services/admin.service';
import { AccountRequest } from '../../../shared/models/account-request.model';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatIconModule],
  template: `
    <div class="container" *ngIf="request">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Customer Detail — Request #{{ request.requestId }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item><strong>Branch:</strong>&nbsp;{{ request.branch }}</mat-list-item>
            <mat-list-item><strong>Account Type:</strong>&nbsp;{{ request.accountType }}</mat-list-item>
            <mat-list-item><strong>Title:</strong>&nbsp;{{ request.title }}</mat-list-item>
            <mat-list-item><strong>Name:</strong>&nbsp;{{ request.firstName }} {{ request.lastName }}</mat-list-item>
            <mat-list-item><strong>Date of Birth:</strong>&nbsp;{{ request.dob }}</mat-list-item>
            <mat-list-item><strong>Work Phone:</strong>&nbsp;{{ request.workPhone }}</mat-list-item>
            <mat-list-item><strong>Home Phone:</strong>&nbsp;{{ request.homePhone }}</mat-list-item>
            <mat-list-item><strong>Address:</strong>&nbsp;{{ request.address }}</mat-list-item>
            <mat-list-item><strong>State:</strong>&nbsp;{{ request.state }}</mat-list-item>
            <mat-list-item><strong>Zip:</strong>&nbsp;{{ request.zip }}</mat-list-item>
            <mat-list-item><strong>Email:</strong>&nbsp;{{ request.email }}</mat-list-item>
            <mat-list-item><strong>Status:</strong>&nbsp;{{ request.status }}</mat-list-item>
          </mat-list>
        </mat-card-content>
        <mat-card-actions>
          <button mat-stroked-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon> Back to Approvals
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 40px auto; padding: 0 20px; }
    mat-card-actions { padding: 16px; }
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
