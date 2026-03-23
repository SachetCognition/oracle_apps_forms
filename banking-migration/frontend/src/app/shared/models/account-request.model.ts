export interface AccountRequest {
  requestId?: number;
  branch: string;
  accountType: string;
  title: string;
  firstName: string;
  lastName: string;
  dob: string;
  workPhone: string;
  homePhone: string;
  address: string;
  state: string;
  zip: string;
  email: string;
  status?: string;
}

export interface AccountRequestStatus {
  status: string;
  accountNumber?: string;
}
