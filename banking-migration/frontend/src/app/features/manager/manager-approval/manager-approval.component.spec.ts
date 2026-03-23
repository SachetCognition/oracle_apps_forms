import { of } from 'rxjs';

describe('ManagerApprovalComponent', () => {
  let mockAdmin: { getPendingRequests: jest.Mock; approve: jest.Mock; reject: jest.Mock };
  let mockAuth: { logout: jest.Mock };
  let mockSnackBar: { open: jest.Mock };
  let router: { navigate: jest.Mock };
  let requests: any[];
  const displayedColumns = ['requestId', 'branch', 'accountType', 'firstName', 'lastName', 'status', 'actions'];

  beforeEach(() => {
    mockAdmin = {
      getPendingRequests: jest.fn().mockReturnValue(of([])),
      approve: jest.fn(),
      reject: jest.fn(),
    };
    mockAuth = { logout: jest.fn() };
    mockSnackBar = { open: jest.fn() };
    router = { navigate: jest.fn() };
    requests = [];
    mockAdmin.getPendingRequests().subscribe((data: any) => { requests = data; });
  });

  it('TC-F39: should load pending requests on init', () => {
    expect(mockAdmin.getPendingRequests).toHaveBeenCalled();
  });

  it('TC-F40: should call approve and refresh list', () => {
    mockAdmin.approve.mockReturnValue(of({ accountNumber: 'SAVJOH00001' }));
    mockAdmin.approve(1).subscribe((res: any) => {
      mockSnackBar.open('Approved! Account Number: ' + res.accountNumber, 'Close', { duration: 8000 });
    });
    expect(mockAdmin.approve).toHaveBeenCalledWith(1);
  });
});
