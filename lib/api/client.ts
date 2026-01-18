/**
 * API Client - Centraliza todas las llamadas al backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Helper para manejar respuestas de API
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error desconocido" }));
    throw new Error(error.message || `Error: ${response.status}`);
  }
  return response.json();
}

// Helper para obtener el token del localStorage
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("and_token");
}

// Helper para headers con autenticación
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ==================== AUTH ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: "EMPRESA" | "INFLUENCER";
}

export interface AuthResponse {
  access_token: string;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(response);
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(response);
}

// ==================== USER ====================

export interface MeResponse {
  id: string;
  role: "EMPRESA" | "INFLUENCER" | "ADMIN";
  is_new: boolean;
  has_emitted_first_invoice: boolean;
  created_at: string;
  updated_at: string;
  empresa?: {
    id: string;
    razon_social: string;
    correo_corporativo: string;
    ruc: string;
    telefono: string;
    ciudad: string;
    estado_tributario: "PENDIENTE" | "ACTIVO" | "SUSPENDIDO";
  };
}

export async function getMe(): Promise<MeResponse> {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse<MeResponse>(response);
}

// ==================== EMPRESAS ====================

export interface CreateEmpresaRequest {
  razon_social: string;
  correo_corporativo: string;
  ruc: string;
  telefono: string;
  ciudad: string;
}

export interface EmpresaResponse {
  id: string;
  razon_social: string;
  correo_corporativo: string;
  ruc: string;
  telefono: string;
  ciudad: string;
  estado_tributario: "PENDIENTE" | "ACTIVO" | "SUSPENDIDO";
  created_at: string;
}

export async function createEmpresa(data: CreateEmpresaRequest): Promise<EmpresaResponse> {
  const response = await fetch(`${API_BASE_URL}/empresas`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<EmpresaResponse>(response);
}

export async function getMyEmpresa(): Promise<EmpresaResponse> {
  const response = await fetch(`${API_BASE_URL}/empresas/mine`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse<EmpresaResponse>(response);
}

// ==================== FACTURACIÓN ====================

export interface CreateFacturacionRequest {
  empresaId: string;
  plataforma: "META" | "TIKTOK" | "GOOGLE" | "OTRO";
  monto_solicitado: number;
}

export interface FacturacionRequest {
  id: string;
  empresa_id: string;
  plataforma: "META" | "TIKTOK" | "GOOGLE" | "OTRO";
  monto_solicitado: number;
  base_calculada?: number;
  iva?: number;
  isd_evitado?: number;
  total_facturado?: number;
  estado: "REQUEST_CREATED" | "CALCULATED" | "APPROVED_BY_CLIENT" | "INVOICED" | "PAID" | "RECHARGE_EXECUTED" | "COMPLETED" | "ERROR";
  created_by: string;
  created_at: string;
  updated_at: string;
  error_message?: string;
  invoice_number?: string;
}

export interface ApproveFacturacionRequest {
  requestId: string;
}

export async function createFacturacionRequest(data: CreateFacturacionRequest): Promise<FacturacionRequest> {
  const response = await fetch(`${API_BASE_URL}/facturacion/request`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<FacturacionRequest>(response);
}

export async function getMyFacturacionRequests(): Promise<FacturacionRequest[]> {
  const response = await fetch(`${API_BASE_URL}/facturacion/mine`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse<FacturacionRequest[]>(response);
}

export async function approveFacturacionRequest(requestId: string): Promise<FacturacionRequest> {
  const response = await fetch(`${API_BASE_URL}/facturacion/approve`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ requestId }),
  });
  return handleResponse<FacturacionRequest>(response);
}

export async function getAllFacturacionRequests(): Promise<FacturacionRequest[]> {
  const response = await fetch(`${API_BASE_URL}/facturacion/all`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse<FacturacionRequest[]>(response);
}

export async function invoiceFacturacionRequest(requestId: string): Promise<FacturacionRequest> {
  const response = await fetch(`${API_BASE_URL}/facturacion/${requestId}/invoice`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  return handleResponse<FacturacionRequest>(response);
}

export async function markFacturacionAsPaid(requestId: string): Promise<FacturacionRequest> {
  const response = await fetch(`${API_BASE_URL}/facturacion/${requestId}/paid`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  return handleResponse<FacturacionRequest>(response);
}

export async function completeFacturacionRequest(requestId: string): Promise<FacturacionRequest> {
  const response = await fetch(`${API_BASE_URL}/facturacion/${requestId}/complete`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  return handleResponse<FacturacionRequest>(response);
}

// ==================== STORAGE ====================

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("and_token", token);
  }
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("and_token");
  }
}

export function hasToken(): boolean {
  return getAuthToken() !== null;
}
