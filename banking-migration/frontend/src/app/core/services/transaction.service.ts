import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, CreateTransaction } from '../../shared/models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly apiUrl = '/api/transactions';

  constructor(private http: HttpClient) {}

  create(data: CreateTransaction): Observable<{ transactionId: number }> {
    return this.http.post<{ transactionId: number }>(this.apiUrl, data);
  }

  getHistory(startDate: string, endDate: string): Observable<Transaction[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<Transaction[]>(this.apiUrl, { params });
  }
}
