import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule],
  template: `
    <div class="dashboard-container">
      <h2>Customer Dashboard</h2>
      <p class="dashboard-subtitle">Select a service below to get started</p>
      <div class="grid">
        <mat-card class="service-card" (click)="navigate('/customer/account-opening')">
          <mat-icon class="service-icon" style="color:#3f51b5">add_circle</mat-icon>
          <h3>Account Opening</h3>
          <p>Apply for a new bank account</p>
        </mat-card>
        <mat-card class="service-card" (click)="navigate('/customer/check-status')">
          <mat-icon class="service-icon" style="color:#ff9800">search</mat-icon>
          <h3>Check Status</h3>
          <p>Check your account request status</p>
        </mat-card>
        <mat-card class="service-card" (click)="navigate('/customer/register')">
          <mat-icon class="service-icon" style="color:#4caf50">app_registration</mat-icon>
          <h3>Online Registration</h3>
          <p>Register for online banking</p>
        </mat-card>
        <mat-card class="service-card" (click)="navigate('/customer/interest-calculator')">
          <mat-icon class="service-icon" style="color:#9c27b0">calculate</mat-icon>
          <h3>Interest Calculator</h3>
          <p>Calculate loan interest</p>
        </mat-card>
        <mat-card class="service-card" (click)="navigate('/customer/login')">
          <mat-icon class="service-icon" style="color:#00bcd4">login</mat-icon>
          <h3>Customer Login</h3>
          <p>Login to your online banking account</p>
        </mat-card>
        <mat-card class="service-card" (click)="navigate('/customer/transactions/new')">
          <mat-icon class="service-icon" style="color:#e91e63">payment</mat-icon>
          <h3>Transaction Entry</h3>
          <p>Make a new transaction</p>
        </mat-card>
        <mat-card class="service-card" (click)="navigate('/customer/transactions/history')">
          <mat-icon class="service-icon" style="color:#607d8b">history</mat-icon>
          <h3>Transaction History</h3>
          <p>View your transaction history</p>
        </mat-card>
        <mat-card class="service-card logout-card" (click)="logout()">
          <mat-icon class="service-icon" style="color:#f44336">logout</mat-icon>
          <h3>Logout</h3>
          <p>Sign out of your account</p>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 20px;
    }
    h2 {
      text-align: center;
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 8px;
      color: #1a237e;
    }
    .dashboard-subtitle {
      text-align: center;
      color: #666;
      margin: 0 0 32px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
    .service-card {
      cursor: pointer;
      text-align: center;
      padding: 28px 16px 20px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 24px rgba(0,0,0,0.12) !important;
    }
    .service-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      margin-bottom: 12px;
    }
    .service-card h3 {
      margin: 0 0 6px;
      font-size: 1rem;
      font-weight: 600;
    }
    .service-card p {
      margin: 0;
      font-size: 0.85rem;
      color: #888;
      line-height: 1.4;
    }
    .logout-card { opacity: 0.8; }
    .logout-card:hover { opacity: 1; }
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
