import { FormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';

describe('CheckStatusComponent', () => {
  let fb: FormBuilder;
  let form: any;
  let mockService: { getStatus: jest.Mock };
  let result: any;

  beforeEach(() => {
    fb = new FormBuilder();
    mockService = { getStatus: jest.fn() };
    result = null;
    form = fb.group({ requestId: ['', Validators.required] });
  });

  it('TC-F11: should have invalid form when empty', () => {
    expect(form.valid).toBeFalsy();
  });

  it('TC-F12: should display ENTERED status', () => {
    mockService.getStatus.mockReturnValue(of({ status: 'ENTERED' }));
    form.patchValue({ requestId: 1 });
    mockService.getStatus(form.value.requestId).subscribe((res: any) => { result = res; });
    expect(result?.status).toBe('ENTERED');
  });

  it('TC-F13: should display APPROVED status with account number', () => {
    mockService.getStatus.mockReturnValue(of({ status: 'APPROVED', accountNumber: 'SAVJOH00001' }));
    form.patchValue({ requestId: 1 });
    mockService.getStatus(form.value.requestId).subscribe((res: any) => { result = res; });
    expect(result?.status).toBe('APPROVED');
    expect(result?.accountNumber).toBe('SAVJOH00001');
  });

  it('TC-F14: should display REJECTED status', () => {
    mockService.getStatus.mockReturnValue(of({ status: 'REJECTED' }));
    form.patchValue({ requestId: 1 });
    mockService.getStatus(form.value.requestId).subscribe((res: any) => { result = res; });
    expect(result?.status).toBe('REJECTED');
  });
});
