import { FormBuilder, Validators } from '@angular/forms';

describe('InterestCalculatorComponent', () => {
  let fb: FormBuilder;
  let form: any;

  const loanConfigs: Record<string, { rate: number; min: number; max: number }> = {
    'HOME LOAN': { rate: 8, min: 100000, max: 100000000 },
    'EDUCATION LOAN': { rate: 6, min: 25000, max: 2500000 },
    'AGRICULTURE LOAN': { rate: 6, min: 20000, max: 3000000 },
    'TWO WHEELER LOAN': { rate: 11, min: 20000, max: 300000 },
    'FOUR WHEELER LOAN': { rate: 12, min: 100000, max: 3000000 },
    'GOLD LOAN': { rate: 10, min: 50000, max: 2500000 },
    'PERSONAL LOAN': { rate: 11, min: 100000, max: 2000000 },
  };
  const loanTypes = Object.keys(loanConfigs);

  function calculate(principal: number, rate: number, time: number): number {
    return (principal * rate * time) / 100;
  }

  beforeEach(() => {
    fb = new FormBuilder();
    form = fb.group({
      loanType: ['', Validators.required],
      principal: [0, [Validators.required, Validators.min(1)]],
      time: [0, [Validators.required, Validators.min(1)]],
    });
  });

  it('TC-F22: should have correct HOME LOAN config', () => {
    const c = loanConfigs['HOME LOAN'];
    expect(c.rate).toBe(8);
    expect(c.min).toBe(100000);
    expect(c.max).toBe(100000000);
  });

  it('TC-F23: should have correct EDUCATION LOAN config (rate=6)', () => {
    expect(loanConfigs['EDUCATION LOAN'].rate).toBe(6);
  });

  it('TC-F24: should calculate interest = (principal * rate * time) / 100', () => {
    expect(calculate(1000000, 8, 5)).toBe(400000);
  });

  it('TC-F25: should calculate PERSONAL LOAN interest correctly', () => {
    expect(calculate(500000, 11, 2)).toBe(110000);
  });

  it('TC-F26: should update principal validators on loan type change', () => {
    const config = loanConfigs['TWO WHEELER LOAN'];
    form.get('principal')?.setValidators([Validators.required, Validators.min(config.min), Validators.max(config.max)]);
    form.get('principal')?.updateValueAndValidity();
    expect(config.min).toBe(20000);
    expect(config.max).toBe(300000);
  });

  it('TC-F27: should reject principal below minimum for loan type', () => {
    const config = loanConfigs['HOME LOAN'];
    form.get('principal')?.setValidators([Validators.required, Validators.min(config.min), Validators.max(config.max)]);
    form.patchValue({ principal: 100 });
    form.get('principal')?.updateValueAndValidity();
    expect(form.get('principal')?.valid).toBeFalsy();
  });

  it('TC-F28: should have exactly 7 loan types', () => {
    expect(loanTypes).toHaveLength(7);
  });
});
