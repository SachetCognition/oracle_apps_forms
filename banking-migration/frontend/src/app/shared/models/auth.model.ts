export interface CustomerLoginRequest {
  accountNumber: string;
  password: string;
}

export interface ManagerLoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  accountNumber: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface RegisterResponse {
  message: string;
}
