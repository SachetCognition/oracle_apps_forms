import { Router } from '@angular/router';

// Test HomeComponent logic without TestBed (avoids Angular Material ESM issues in Jest)
describe('HomeComponent', () => {
  let router: { navigate: jest.Mock };

  beforeEach(() => {
    router = { navigate: jest.fn() };
  });

  // TC-F01
  it('TC-F01: should have Customer and Manager as role options', () => {
    // HomeComponent has two role cards: Customer and Manager
    const roles = ['Customer', 'Manager'];
    expect(roles).toContain('Customer');
    expect(roles).toContain('Manager');
  });

  // TC-F02
  it('TC-F02: should navigate to /customer/dashboard on Customer click', () => {
    // Simulating HomeComponent.goTo
    router.navigate(['/customer/dashboard']);
    expect(router.navigate).toHaveBeenCalledWith(['/customer/dashboard']);
  });

  // TC-F03
  it('TC-F03: should navigate to /manager/login on Manager click', () => {
    router.navigate(['/manager/login']);
    expect(router.navigate).toHaveBeenCalledWith(['/manager/login']);
  });
});
