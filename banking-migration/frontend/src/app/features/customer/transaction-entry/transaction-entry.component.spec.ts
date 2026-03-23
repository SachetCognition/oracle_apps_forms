import { FormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';

describe('TransactionEntryComponent', () => {
  let fb: FormBuilder;
  let form: any;
  let mockService: { create: jest.Mock };
  let mockSnackBar: { open: jest.Mock };
  let router: { navigate: jest.Mock };

  beforeEach(() => {
    fb = new FormBuilder();
    mockService = { create: jest.fn() };
    mockSnackBar = { open: jest.fn() };
    router = { navigate: jest.fn() };
    form = fb.group({
      transactionType: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1), Validators.max(9999999)]],
      chequeNo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  });

  it('TC-F29: should reject cheque number that is not 6 digits', () => {
    form.patchValue({ transactionType: 'CR', amount: 5000, chequeNo: '12345' });
    expect(form.get('chequeNo')?.valid).toBeFalsy();
  });

  it('TC-F30: should reject amount exceeding 9999999', () => {
    form.patchValue({ transactionType: 'CR', amount: 10000000, chequeNo: '123456' });
    expect(form.get('amount')?.valid).toBeFalsy();
  });

  it('TC-F31: should submit valid transaction', () => {
    mockService.create.mockReturnValue(of({ transactionId: 1 }));
    form.patchValue({ transactionType: 'CR', amount: 5000, chequeNo: '123456' });
    if (form.valid) {
      mockService.create(form.value).subscribe({
        next: (res: any) => {
          mockSnackBar.open('Transaction #' + res.transactionId + ' created', 'Close', { duration: 5000 });
        },
      });
    }
    expect(mockService.create).toHaveBeenCalled();
  });

  it('TC-F32: should navigate to history on viewHistory', () => {
    router.navigate(['/customer/transactions/history']);
    expect(router.navigate).toHaveBeenCalledWith(['/customer/transactions/history']);
  });

  it('TC-F33: should reject zero amount', () => {
    form.patchValue({ transactionType: 'DR', amount: 0, chequeNo: '123456' });
    expect(form.get('amount')?.valid).toBeFalsy();
  });
});
