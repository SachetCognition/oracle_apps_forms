import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="dashboard-container">
      <h2>Customer Dashboard</h2>
      <mat-card>
        <mat-nav-list>
          <a mat-list-item (click)="navigate('/customer/account-opening')">
            <mat-icon matListItemIcon>add_circle</mat-icon>
            <span matListItemTitle>Account Opening</span>
            <span matListItemLine>Apply for a new bank account</span>
          </a>
          <a mat-list-item (click)="navigate('/customer/check-status')">
            <mat-icon matListItemIcon>search</mat-icon>
            <span matListItemTitle>Check Status</span>
            <span matListItemLine>Check your account request status</span>
          </a>
          <a mat-list-item (click)="navigate('/customer/register')">
            <mat-icon matListItemIcon>app_registration</mat-icon>
            <span matListItemTitle>Online Registration</span>
            <span matListItemLine>Register for online banking</span>
          </a>
          <a mat-list-item (click)="navigate('/customer/interest-calculator')">
            <mat-icon matListItemIcon>calculate</mat-icon>
            <span matListItemTitle>Interest Calculator</span>
            <span matListItemLine>Calculate loan interest</span>
          </a>
          <a mat-list-item (click)="navigate('/customer/login')">
            <mat-icon matListItemIcon>login</mat-icon>
            <span matListItemTitle>Customer Login</span>
            <span matListItemLine>Login to your online banking account</span>
          </a>
          <a mat-list-item (click)="navigate('/customer/transactions/new')">
            <mat-icon matListItemIcon>payment</mat-icon>
            <span matListItemTitle>Transaction Entry</span>
            <span matListItemLine>Make a new transaction</span>
          </a>
          <a mat-list-item (click)="navigate('/customer/transactions/history')">
            <mat-icon matListItemIcon>history</mat-icon>
            <span matListItemTitle>Transaction History</span>
            <span matListItemLine>View your transaction history</span>
          </a>
          <a mat-list-item (click)="logout()">
            <mat-icon matListItemIcon>logout</mat-icon>
            <span matListItemTitle>Logout</span>
          </a>
        </mat-nav-list>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 600px; margin: 40px auto; padding: 0 20px; }
    h2 { text-align: center; margin-bottom: 24px; }
  `],
})
export class CustomerDashboardComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }
}
