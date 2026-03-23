import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <mat-icon class="hero-icon">account_balance</mat-icon>
        <h1>Online Banking System</h1>
        <p class="subtitle">Welcome to our banking portal. Please select your role to continue.</p>
      </div>
      <div class="cards">
        <mat-card class="role-card customer-card" (click)="goTo('/customer/dashboard')">
          <mat-card-header>
            <div class="card-icon-wrapper customer-bg">
              <mat-icon>person</mat-icon>
            </div>
            <mat-card-title>Customer</mat-card-title>
            <mat-card-subtitle>Access your banking services</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Open accounts, check status, perform transactions, and more.</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-raised-button color="primary">Continue as Customer</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="role-card manager-card" (click)="goTo('/manager/login')">
          <mat-card-header>
            <div class="card-icon-wrapper manager-bg">
              <mat-icon>admin_panel_settings</mat-icon>
            </div>
            <mat-card-title>Manager</mat-card-title>
            <mat-card-subtitle>Administrative portal</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Review requests, approve accounts, and manage customers.</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-raised-button color="accent">Continue as Manager</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      text-align: center;
      padding: 20px 20px 40px;
      max-width: 860px;
      margin: 0 auto;
    }
    .hero-section { margin-bottom: 48px; }
    .hero-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #3f51b5;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 2.4rem;
      font-weight: 700;
      margin: 0 0 12px;
      color: #1a237e;
    }
    .subtitle { color: #666; font-size: 1.1rem; margin: 0; }
    .cards {
      display: flex;
      gap: 32px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .role-card {
      cursor: pointer;
      max-width: 380px;
      flex: 1;
      min-width: 280px;
      transition: transform 0.2s, box-shadow 0.2s;
      padding: 24px 20px 16px;
    }
    .role-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.15) !important;
    }
    .card-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }
    .card-icon-wrapper mat-icon { color: white; font-size: 28px; width: 28px; height: 28px; }
    .customer-bg { background: linear-gradient(135deg, #3f51b5, #5c6bc0); }
    .manager-bg { background: linear-gradient(135deg, #009688, #4db6ac); }
    mat-card-content { padding: 16px 0; }
    mat-card-content p { color: #555; line-height: 1.5; margin: 0; }
    mat-card-actions { padding: 0 0 8px; }
  `],
})
export class HomeComponent {
  constructor(private router: Router) {}

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
