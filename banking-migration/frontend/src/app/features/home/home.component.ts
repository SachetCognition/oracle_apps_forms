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
      <h1>Online Banking System</h1>
      <p class="subtitle">Welcome to our banking portal. Please select your role to continue.</p>
      <div class="cards">
        <mat-card class="role-card" (click)="goTo('/customer/dashboard')">
          <mat-card-header>
            <mat-icon mat-card-avatar>person</mat-icon>
            <mat-card-title>Customer</mat-card-title>
            <mat-card-subtitle>Access your banking services</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Open accounts, check status, perform transactions, and more.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">Continue as Customer</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="role-card" (click)="goTo('/manager/login')">
          <mat-card-header>
            <mat-icon mat-card-avatar>admin_panel_settings</mat-icon>
            <mat-card-title>Manager</mat-card-title>
            <mat-card-subtitle>Administrative portal</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Review requests, approve accounts, and manage customers.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="accent">Continue as Manager</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container { text-align: center; padding: 40px 20px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 2.5rem; margin-bottom: 8px; }
    .subtitle { color: #666; margin-bottom: 40px; font-size: 1.1rem; }
    .cards { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
    .role-card { cursor: pointer; max-width: 340px; flex: 1; transition: transform 0.2s; }
    .role-card:hover { transform: translateY(-4px); box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
    mat-card-actions { padding: 16px; }
  `],
})
export class HomeComponent {
  constructor(private router: Router) {}

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
