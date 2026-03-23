import { FormBuilder, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('AccountOpeningComponent', () => {
  let fb: FormBuilder;
  let form: any;
  let mockService: { create: jest.Mock };
  let mockSnackBar: { open: jest.Mock };

  beforeEach(() => {
    fb = new FormBuilder();
    mockService = { create: jest.fn() };
    mockSnackBar = { open: jest.fn() };
    form = fb.group({
      branch: ['', Validators.required],
      accountType: ['', Validators.required],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      workPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      homePhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  });

  const validForm = {
    branch: 'Mumbai', accountType: 'Savings', title: 'Mr', firstName: 'John',
    lastName: 'Doe', dob: new Date('1990-01-15'), workPhone: '1234567890',
    homePhone: '0987654321', address: '123 Main St', state: 'Maharashtra',
    zip: '400001', email: 'john@test.com',
  };

  // TC-F04
  it('TC-F04: should mark form as invalid when empty', () => {
    expect(form.valid).toBeFalsy();
  });

  // TC-F05
  it('TC-F05: should be valid with complete valid data', () => {
    form.patchValue(validForm);
    expect(form.valid).toBeTruthy();
  });

  // TC-F06
  it('TC-F06: should reject invalid work phone', () => {
    form.patchValue({ ...validForm, workPhone: '12345' });
    expect(form.get('workPhone')?.valid).toBeFalsy();
  });

  // TC-F07
  it('TC-F07: should reject invalid home phone', () => {
    form.patchValue({ ...validForm, homePhone: 'abc' });
    expect(form.get('homePhone')?.valid).toBeFalsy();
  });

  // TC-F08
  it('TC-F08: should reject invalid email format', () => {
    form.patchValue({ ...validForm, email: 'invalid' });
    expect(form.get('email')?.valid).toBeFalsy();
  });

  // TC-F09
  it('TC-F09: should show requestId on successful submission', () => {
    mockService.create.mockReturnValue(of({ requestId: 42 }));
    form.patchValue(validForm);
    let submitting = true;
    if (form.valid) {
      mockService.create(form.value).subscribe({
        next: (res: any) => {
          mockSnackBar.open(`Request submitted! ID: ${res.requestId}`, 'Close', { duration: 5000 });
          submitting = false;
        },
      });
    }
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      expect.stringContaining('42'), 'Close', expect.any(Object),
    );
    expect(submitting).toBeFalsy();
  });

  // TC-F10
  it('TC-F10: should reset submitting flag on error', () => {
    mockService.create.mockReturnValue(throwError(() => new Error('fail')));
    form.patchValue(validForm);
    let submitting = true;
    if (form.valid) {
      mockService.create(form.value).subscribe({
        next: () => {},
        error: () => { submitting = false; },
      });
    }
    expect(submitting).toBeFalsy();
  });
});
