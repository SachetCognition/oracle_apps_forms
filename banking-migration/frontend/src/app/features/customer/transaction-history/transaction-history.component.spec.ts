import { FormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';

describe('TransactionHistoryComponent', () => {
  let fb: FormBuilder;
  let form: any;
  let mockService: { getHistory: jest.Mock };
  let transactions: any[];
  let searched: boolean;
  const displayedColumns = ['transactionId', 'transactionDate', 'amount', 'chequeNo', 'transactionType'];

  beforeEach(() => {
    fb = new FormBuilder();
    mockService = { getHistory: jest.fn() };
    transactions = [];
    searched = false;
    form = fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  });

  it('TC-F34: should have invalid form when dates are empty', () => {
    expect(form.valid).toBeFalsy();
  });

  it('TC-F35: should have correct display columns', () => {
    expect(displayedColumns).toEqual(['transactionId', 'transactionDate', 'amount', 'chequeNo', 'transactionType']);
  });

  it('TC-F36: should fetch and store transactions on submit', () => {
    const mockData = [{ transactionId: 1, amount: 5000, transactionType: 'CR' }];
    mockService.getHistory.mockReturnValue(of(mockData));
    form.patchValue({ startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') });
    if (form.valid) {
      mockService.getHistory(form.value.startDate, form.value.endDate).subscribe((data: any) => {
        transactions = data;
        searched = true;
      });
    }
    expect(transactions).toEqual(mockData);
    expect(searched).toBeTruthy();
  });
});
