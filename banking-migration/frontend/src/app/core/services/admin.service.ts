import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountRequest } from '../../shared/models/account-request.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = '/api/admin';

  constructor(private http: HttpClient) {}

  getPendingRequests(): Observable<AccountRequest[]> {
    return this.http.get<AccountRequest[]>(`${this.apiUrl}/pending-requests`);
  }

  approve(requestId: number): Observable<{ accountNumber: string }> {
    return this.http.post<{ accountNumber: string }>(`${this.apiUrl}/approve/${requestId}`, {});
  }

  reject(requestId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reject/${requestId}`, {});
  }

  getRequest(requestId: number): Observable<AccountRequest> {
    return this.http.get<AccountRequest>(`${this.apiUrl}/requests/${requestId}`);
  }
}
