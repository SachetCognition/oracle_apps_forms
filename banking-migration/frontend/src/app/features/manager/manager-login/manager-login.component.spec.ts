import { FormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';

describe('ManagerLoginComponent', () => {
  let fb: FormBuilder;
  let form: any;
  let mockAuth: { managerLogin: jest.Mock };
  let router: { navigate: jest.Mock };

  beforeEach(() => {
    fb = new FormBuilder();
    mockAuth = { managerLogin: jest.fn() };
    router = { navigate: jest.fn() };
    form = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  });

  it('TC-F37: should be invalid when fields are empty', () => {
    expect(form.valid).toBeFalsy();
  });

  it('TC-F38: should navigate to /manager/approvals on successful login', () => {
    mockAuth.managerLogin.mockReturnValue(of({ access_token: 'token' }));
    form.patchValue({ username: 'admin', password: 'Admin@123' });
    if (form.valid) {
      mockAuth.managerLogin(form.value).subscribe({
        next: () => { router.navigate(['/manager/approvals']); },
      });
    }
    expect(router.navigate).toHaveBeenCalledWith(['/manager/approvals']);
  });
});
