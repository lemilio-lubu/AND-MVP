import { validateCompanyRegistration } from "./validation";
import {
  LoginResult,
  MockAuthError,
  MockCompanyUser,
  MockLockout,
  MockSession,
  RegisterCompanyInput,
} from "./types";

const USERS_KEY = "and_mock_users_v1";
const SESSION_KEY = "and_mock_session_v1";
const LOCKOUTS_KEY = "and_mock_lockouts_v1";

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!isBrowser()) {
    throw new MockAuthError("STORAGE_UNAVAILABLE", "Storage no disponible");
  }
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers(): MockCompanyUser[] {
  return readJson<MockCompanyUser[]>(USERS_KEY, []);
}

function setUsers(users: MockCompanyUser[]): void {
  writeJson(USERS_KEY, users);
}

function getLockouts(): MockLockout[] {
  return readJson<MockLockout[]>(LOCKOUTS_KEY, []);
}

function setLockouts(lockouts: MockLockout[]): void {
  writeJson(LOCKOUTS_KEY, lockouts);
}

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function generateId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function derivePasswordHash(password: string, salt: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const data = new TextEncoder().encode(`${salt}:${password}`);
    const digest = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  // Fallback controlado para entornos sin Web Crypto (solo demo)
  let hash = 0;
  const raw = `${salt}:${password}`;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `fallback_${Math.abs(hash)}`;
}

function createSession(userId: string): MockSession {
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + SESSION_TTL_MS);
  const session: MockSession = {
    userId,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
  writeJson(SESSION_KEY, session);
  return session;
}

function getLockoutRecord(email: string): MockLockout | undefined {
  const normalizedEmail = normalizeEmail(email);
  return getLockouts().find((record) => record.email === normalizedEmail);
}

function clearLockout(email: string): void {
  const normalizedEmail = normalizeEmail(email);
  const next = getLockouts().filter((record) => record.email !== normalizedEmail);
  setLockouts(next);
}

function registerFailedAttempt(email: string): MockLockout {
  const normalizedEmail = normalizeEmail(email);
  const lockouts = getLockouts();
  const now = new Date();
  const existing = lockouts.find((record) => record.email === normalizedEmail);

  const failedAttempts = (existing?.failedAttempts ?? 0) + 1;
  const updated: MockLockout = {
    email: normalizedEmail,
    failedAttempts,
    lastFailedAt: now.toISOString(),
    lockedUntil:
      failedAttempts >= MAX_FAILED_ATTEMPTS
        ? new Date(now.getTime() + LOCKOUT_MS).toISOString()
        : existing?.lockedUntil,
  };

  const next = lockouts.filter((record) => record.email !== normalizedEmail);
  next.push(updated);
  setLockouts(next);
  return updated;
}

function assertNotLocked(email: string): void {
  const lockout = getLockoutRecord(email);
  if (!lockout?.lockedUntil) return;

  const lockUntil = new Date(lockout.lockedUntil).getTime();
  if (lockUntil > Date.now()) {
    throw new MockAuthError(
      "ACCOUNT_LOCKED",
      "Cuenta temporalmente bloqueada por múltiples intentos fallidos. Intenta más tarde."
    );
  }

  clearLockout(email);
}

export async function registerCompanyMock(input: RegisterCompanyInput): Promise<LoginResult> {
  const payload: RegisterCompanyInput = {
    companyName: input.companyName.trim(),
    email: normalizeEmail(input.email),
    ruc: input.ruc.trim(),
    telefono: input.telefono.trim(),
    ciudad: input.ciudad.trim(),
    password: input.password,
  };

  const validationErrors = validateCompanyRegistration(payload);
  if (validationErrors.length > 0) {
    throw new MockAuthError("VALIDATION_ERROR", validationErrors[0]);
  }

  const users = getUsers();
  const emailExists = users.some((u) => normalizeEmail(u.email) === payload.email);
  if (emailExists) {
    throw new MockAuthError("EMAIL_ALREADY_EXISTS", "Este correo corporativo ya está registrado");
  }

  const passwordSalt = generateId("salt");
  const passwordHash = await derivePasswordHash(payload.password, passwordSalt);
  const userId = generateId("mock_company");

  const user: MockCompanyUser = {
    id: userId,
    role: "empresa",
    companyName: payload.companyName,
    email: payload.email,
    ruc: payload.ruc,
    telefono: payload.telefono,
    ciudad: payload.ciudad,
    passwordHash,
    passwordSalt,
    createdAt: nowIso(),
  };

  users.push(user);
  setUsers(users);
  createSession(userId);
  clearLockout(payload.email);

  return { userId };
}

export async function loginCompanyMock(email: string, password: string): Promise<LoginResult> {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    throw new MockAuthError("VALIDATION_ERROR", "Ingresa email y contraseña");
  }

  assertNotLocked(normalizedEmail);

  const users = getUsers();
  const user = users.find((u) => normalizeEmail(u.email) === normalizedEmail);
  if (!user) {
    registerFailedAttempt(normalizedEmail);
    throw new MockAuthError("ACCOUNT_NOT_FOUND", "Cuenta no encontrada o credenciales inválidas");
  }

  const computedHash = await derivePasswordHash(password, user.passwordSalt);
  if (computedHash !== user.passwordHash) {
    const lockout = registerFailedAttempt(normalizedEmail);
    if (lockout.lockedUntil && new Date(lockout.lockedUntil).getTime() > Date.now()) {
      throw new MockAuthError(
        "ACCOUNT_LOCKED",
        "Cuenta temporalmente bloqueada por múltiples intentos fallidos. Intenta más tarde."
      );
    }
    throw new MockAuthError("INVALID_CREDENTIALS", "Credenciales inválidas");
  }

  clearLockout(normalizedEmail);
  createSession(user.id);
  return { userId: user.id };
}

export function getCurrentMockCompanyUser(): MockCompanyUser | null {
  const session = readJson<MockSession | null>(SESSION_KEY, null);
  if (!session?.userId || !session.expiresAt) return null;

  const expiresAt = new Date(session.expiresAt).getTime();
  if (Number.isNaN(expiresAt) || expiresAt <= Date.now()) {
    logoutMock();
    return null;
  }

  const users = getUsers();
  return users.find((user) => user.id === session.userId) ?? null;
}

export function logoutMock(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_KEY);
}

export function clearMockAuthData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LOCKOUTS_KEY);
}
