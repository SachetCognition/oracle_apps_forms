import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountRequest, AccountRequestStatus } from '../../shared/models/account-request.model';

@Injectable({ providedIn: 'root' })
export class AccountRequestService {
  private readonly apiUrl = '/api/account-requests';

  constructor(private http: HttpClient) {}

  create(data: AccountRequest): Observable<{ requestId: number }> {
    return this.http.post<{ requestId: number }>(this.apiUrl, data);
  }

  getStatus(requestId: number): Observable<AccountRequestStatus> {
    return this.http.get<AccountRequestStatus>(`${this.apiUrl}/${requestId}/status`);
  }
}
