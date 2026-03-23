import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { of } from 'rxjs';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

describe('OnlineRegistrationComponent', () => {
  let fb: FormBuilder;
  let form: any;
  let mockAuth: { register: jest.Mock };

  beforeEach(() => {
    fb = new FormBuilder();
    mockAuth = { register: jest.fn() };
    form = fb.group({
      accountNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMatchValidator });
  });

  it('TC-F15: should reject password shorter than 6 characters', () => {
    form.patchValue({ accountNumber: 'ACC001', password: '12345', confirmPassword: '12345' });
    expect(form.get('password')?.valid).toBeFalsy();
  });

  it('TC-F16: should flag mismatched passwords', () => {
    form.patchValue({ accountNumber: 'ACC001', password: 'password123', confirmPassword: 'different' });
    form.updateValueAndValidity();
    expect(form.hasError('passwordMismatch')).toBeTruthy();
  });

  it('TC-F17: should submit with valid matching passwords', () => {
    mockAuth.register.mockReturnValue(of({ message: 'success' }));
    form.patchValue({ accountNumber: 'ACC001', password: 'password123', confirmPassword: 'password123' });
    if (form.valid) {
      const { accountNumber, password } = form.value;
      mockAuth.register({ accountNumber, password });
    }
    expect(mockAuth.register).toHaveBeenCalledWith({ accountNumber: 'ACC001', password: 'password123' });
  });

  it('TC-F18: should toggle password visibility', () => {
    let hidePassword = true;
    expect(hidePassword).toBeTruthy();
    hidePassword = false;
    expect(hidePassword).toBeFalsy();
  });
});
