// Tipos de dominio para facturación
// Estados del proceso REAL de AND (con aprobación humana)
export type BillingStatus = 
  | "REQUEST_CREATED"        // Cliente solicita facturación
  | "CALCULATED"             // Admin calcula en Excel
  | "APPROVED_BY_CLIENT"     // Cliente aprueba el monto
  | "INVOICED"               // Admin emite factura real
  | "PAID"                   // Cliente pagó
  | "RECHARGE_EXECUTED"      // AND ejecutó recarga con MISIVA
  | "COMPLETED"              // Proceso cerrado
  | "ERROR";                 // Error en cualquier paso

export type UserType = "empresa" | "influencer" | "admin";

export interface User {
  id: string;
  type: UserType;
  isNew: boolean;
  email: string;
  name: string;
  rucConnected: boolean;
  hasEmittedFirstInvoice: boolean;
}

// Solicitud de recarga (NO campaña técnica)
// El cliente NO gestiona campañas dentro de AND
// Solo solicita recargas/pauta
export interface RechargeRequest {
  id: string;
  companyId: string;
  platform: "Meta" | "TikTok" | "Google" | "LinkedIn";
  requestedAmount: number;          // Monto solicitado por cliente
  calculatedBase?: number;          // Calculado por admin en Excel
  calculatedCommission?: number;    // Comisión calculada
  calculatedTotal?: number;         // Total calculado por admin
  status: BillingStatus;
  createdAt: Date;
  calculatedAt?: Date;             // Fecha de cálculo por admin
  approvedAt?: Date;               // Fecha de aprobación por cliente
  invoicedAt?: Date;               // Fecha de emisión de factura
  paidAt?: Date;                   // Fecha de pago
  rechargeExecutedAt?: Date;       // Fecha de recarga ejecutada
  completedAt?: Date;              // Fecha de cierre
  errorMessage?: string;
  invoiceNumber?: string;          // Número de factura real
  invoicePdfUrl?: string;          // URL del PDF
  paymentProofUrl?: string;        // Comprobante de pago
}

export interface TaxCalculation {
  iva: number;
  isd: number;
  nonDeductible: number;
  creditCardTotal: number;
  localBillingTotal: number;
  savings: number;
}

// Ya no es Invoice directa, es el resultado de una RechargeRequest aprobada
export interface Invoice {
  id: string;
  requestId: string;             // Link a RechargeRequest
  companyId: string;
  invoiceNumber: string;
  amount: number;
  taxCalculation: TaxCalculation;
  status: "emitida" | "pagada" | "cancelada";
  emittedAt: Date;
  paidAt?: Date;
  pdfUrl?: string;
}

export interface DashboardMetrics {
  totalBilledThisMonth: number;
  accumulatedTaxSavings: number;
  invoicesEmitted: number;
  invoicesPending: number;
  activeRequests: number;          // Solicitudes activas (no "campañas")
}

// Métricas para Admin
export interface AdminMetrics {
  pendingRequests: number;         // Solicitudes pendientes de calcular
  pendingApprovals: number;        // Pendientes de aprobación de cliente
  pendingInvoices: number;         // Pendientes de emitir factura
  pendingPayments: number;         // Pendientes de pago
  pendingRecharges: number;        // Pendientes de ejecutar recarga
  completedThisMonth: number;      // Completadas este mes
  totalRevenue: number;            // Ingresos totales
}
