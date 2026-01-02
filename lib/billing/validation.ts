import { User, RechargeRequest } from "./types";

/**
 * Reglas de validación de negocio
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida si un usuario puede SOLICITAR facturación (no emitir directamente)
 */
export function canRequestBilling(user: User): ValidationResult {
  if (!user.rucConnected) {
    return {
      isValid: false,
      error: "Debes conectar tus datos tributarios (RUC) antes de solicitar facturación",
    };
  }

  return { isValid: true };
}

/**
 * Valida si un admin puede calcular una solicitud
 */
export function canCalculateRequest(request: RechargeRequest): ValidationResult {
  if (request.status !== "REQUEST_CREATED") {
    return {
      isValid: false,
      error: "Solo se pueden calcular solicitudes nuevas",
    };
  }

  if (request.requestedAmount <= 0) {
    return {
      isValid: false,
      error: "El monto solicitado debe ser mayor a 0",
    };
  }

  return { isValid: true };
}

/**
 * Valida si un admin puede emitir factura
 */
export function canEmitInvoice(request: RechargeRequest): ValidationResult {
  if (request.status !== "APPROVED_BY_CLIENT") {
    return {
      isValid: false,
      error: "Solo se pueden emitir facturas de solicitudes aprobadas por el cliente",
    };
  }

  if (!request.calculatedTotal || request.calculatedTotal <= 0) {
    return {
      isValid: false,
      error: "Debe existir un cálculo válido antes de emitir factura",
    };
  }

  return { isValid: true };
}

/**
 * Valida si una solicitud es válida para ser aprobada por el cliente
 */
export function canApproveRequest(request: RechargeRequest): ValidationResult {
  if (request.status !== "CALCULATED") {
    return {
      isValid: false,
      error: "Solo se pueden aprobar solicitudes que ya fueron calculadas",
    };
  }

  if (!request.calculatedTotal) {
    return {
      isValid: false,
      error: "La solicitud debe tener un monto calculado",
    };
  }

  return { isValid: true };
}

/**
 * Determina si un usuario debe ver la gamificación
 */
export function shouldShowGamification(user: User): boolean {
  // Solo usuarios nuevos que no han completado su primera solicitud
  return user.isNew && !user.hasEmittedFirstInvoice;
}

/**
 * Determina el nivel de trayectoria según métricas
 */
export type TrajectoryLevel = "iniciando" | "confianza-comprobada" | "colaborador-estrella" | "socio-estrategico";

export function getUserTrajectory(
  invoicesEmitted: number,
  totalBilled: number
): TrajectoryLevel {
  if (invoicesEmitted === 0) return "iniciando";
  if (invoicesEmitted < 5 || totalBilled < 10000) return "confianza-comprobada";
  if (invoicesEmitted < 20 || totalBilled < 50000) return "colaborador-estrella";
  return "socio-estrategico";
}

/**
 * Determina si un usuario es admin
 */
export function isAdmin(user: User): boolean {
  return user.type === "admin";
}

/**
 * Determina si un usuario es empresa
 */
export function isCompany(user: User): boolean {
  return user.type === "empresa";
}
