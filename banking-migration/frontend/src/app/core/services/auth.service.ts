import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  CustomerLoginRequest,
  ManagerLoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
} from '../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = '/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  customerLogin(data: CustomerLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/customer-login`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('role', 'customer');
        const payload = this.decodeToken(res.access_token);
        localStorage.setItem('accountNumber', payload['accountNumber'] || '');
      }),
    );
  }

  managerLogin(data: ManagerLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/manager-login`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('role', 'manager');
      }),
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('accountNumber');
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getAccountNumber(): string | null {
    return localStorage.getItem('accountNumber');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private decodeToken(token: string): Record<string, string> {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return {};
    }
  }
}
