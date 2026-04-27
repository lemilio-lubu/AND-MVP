export type AuthErrorCode =
  | "VALIDATION_ERROR"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_NOT_FOUND"
  | "ACCOUNT_LOCKED"
  | "SESSION_EXPIRED"
  | "STORAGE_UNAVAILABLE"
  | "UNKNOWN_ERROR";

export interface MockCompanyUser {
  id: string;
  role: "empresa";
  companyName: string;
  email: string;
  ruc: string;
  telefono: string;
  ciudad: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

export interface MockSession {
  userId: string;
  issuedAt: string;
  expiresAt: string;
}

export interface MockLockout {
  email: string;
  failedAttempts: number;
  lastFailedAt: string;
  lockedUntil?: string;
}

export interface RegisterCompanyInput {
  companyName: string;
  email: string;
  ruc: string;
  telefono: string;
  ciudad: string;
  password: string;
}

export interface LoginResult {
  userId: string;
}

export class MockAuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "MockAuthError";
    this.code = code;
  }
}
