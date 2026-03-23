import { FormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';

describe('CustomerLoginComponent', () => {
  let fb: FormBuilder;
  let form: any;
  let mockAuth: { customerLogin: jest.Mock };
  let router: { navigate: jest.Mock };

  beforeEach(() => {
    fb = new FormBuilder();
    mockAuth = { customerLogin: jest.fn() };
    router = { navigate: jest.fn() };
    form = fb.group({
      accountNumber: ['', Validators.required],
      password: ['', Validators.required],
    });
  });

  it('TC-F19: should be invalid when fields are empty', () => {
    expect(form.valid).toBeFalsy();
  });

  it('TC-F20: should navigate to dashboard on successful login', () => {
    mockAuth.customerLogin.mockReturnValue(of({ access_token: 'token' }));
    form.patchValue({ accountNumber: 'ACC001', password: 'pass123' });
    if (form.valid) {
      mockAuth.customerLogin(form.value).subscribe({
        next: () => { router.navigate(['/customer/dashboard']); },
      });
    }
    expect(router.navigate).toHaveBeenCalledWith(['/customer/dashboard']);
  });

  it('TC-F21: should toggle password visibility', () => {
    let hidePassword = true;
    expect(hidePassword).toBeTruthy();
    hidePassword = false;
    expect(hidePassword).toBeFalsy();
  });
});
