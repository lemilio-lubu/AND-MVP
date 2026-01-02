"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import { 
  RechargeRequest,
  AdminMetrics,
  BillingStatus,
  formatCurrency,
  isAdmin
} from "@/lib/billing";
import { 
  Clock, 
  CheckCircle, 
  Receipt, 
  CurrencyDollar,
  Warning,
  Calculator
} from "@phosphor-icons/react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [metrics, setMetrics] = useState<AdminMetrics>({
    pendingRequests: 0,
    pendingApprovals: 0,
    pendingInvoices: 0,
    pendingPayments: 0,
    pendingRecharges: 0,
    completedThisMonth: 0,
    totalRevenue: 0,
  });

  const [requests, setRequests] = useState<RechargeRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RechargeRequest | null>(null);
  const [calculatedValues, setCalculatedValues] = useState({
    base: "",
    commission: "",
    total: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAdmin(user)) {
      router.push("/dashboard");
      return;
    }

    loadMockData();
  }, [user, router]);

  const loadMockData = () => {
    // Mock: métricas admin
    setMetrics({
      pendingRequests: 2,
      pendingApprovals: 1,
      pendingInvoices: 1,
      pendingPayments: 1,
      pendingRecharges: 1,
      completedThisMonth: 15,
      totalRevenue: 45000,
    });

    // Mock: solicitudes en diferentes estados para demostración
    setRequests([
      {
        id: "req-1",
        companyId: "company-1",
        platform: "Meta",
        requestedAmount: 5000,
        status: "REQUEST_CREATED",
        createdAt: new Date(),
      } as RechargeRequest,
      {
        id: "req-2",
        companyId: "company-1",
        platform: "Meta",
        requestedAmount: 2000,
        status: "REQUEST_CREATED",
        createdAt: new Date(),
      } as RechargeRequest,
      {
        id: "req-3",
        companyId: "company-2",
        platform: "TikTok",
        requestedAmount: 3000,
        status: "CALCULATED",
        calculatedBase: 3000,
        calculatedCommission: 165,
        calculatedTotal: 3165,
        createdAt: new Date(),
      } as RechargeRequest,
      {
        id: "req-4",
        companyId: "company-3",
        platform: "Google",
        requestedAmount: 10000,
        status: "APPROVED_BY_CLIENT",
        calculatedBase: 10000,
        calculatedCommission: 550,
        calculatedTotal: 10550,
        createdAt: new Date(),
      } as RechargeRequest,
      {
        id: "req-5",
        companyId: "company-4",
        platform: "LinkedIn",
        requestedAmount: 7000,
        status: "INVOICED",
        calculatedTotal: 7385,
        invoiceNumber: "AND-20260102001",
        createdAt: new Date(),
      } as RechargeRequest,
      {
        id: "req-6",
        companyId: "company-5",
        platform: "Meta",
        requestedAmount: 15000,
        status: "PAID",
        calculatedTotal: 15825,
        invoiceNumber: "AND-20260102002",
        createdAt: new Date(),
      } as RechargeRequest,
      {
        id: "req-7",
        companyId: "company-6",
        platform: "TikTok",
        requestedAmount: 4000,
        status: "RECHARGE_EXECUTED",
        calculatedTotal: 4220,
        createdAt: new Date(),
      } as RechargeRequest,
      {
        id: "req-8",
        companyId: "company-7",
        platform: "Google",
        requestedAmount: 8000,
        status: "COMPLETED",
        calculatedTotal: 8440,
        createdAt: new Date(),
        completedAt: new Date(),
      } as RechargeRequest,
    ]);
  };

  const handleCalculate = (request: RechargeRequest) => {
    setSelectedRequest(request);
    // Pre-cargar valores sugeridos (basado en Excel AND)
    const suggestedBase = request.requestedAmount;
    const suggestedCommission = request.requestedAmount * 0.055; // 5.5% comisión AND
    const suggestedTotal = suggestedBase + suggestedCommission;
    setCalculatedValues({
      base: suggestedBase.toFixed(2),
      commission: suggestedCommission.toFixed(2),
      total: suggestedTotal.toFixed(2),
    });
  };

  const handleSaveCalculation = () => {
    if (!selectedRequest) return;
    
    // Actualizar solicitud con valores calculados
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: "CALCULATED" as BillingStatus,
          calculatedBase: parseFloat(calculatedValues.base),
          calculatedCommission: parseFloat(calculatedValues.commission),
          calculatedTotal: parseFloat(calculatedValues.total),
          calculatedAt: new Date(),
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    
    // Actualizar métricas
    setMetrics(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests - 1,
      pendingApprovals: prev.pendingApprovals + 1,
    }));
    
    console.log("✅ Cálculo guardado:", calculatedValues);
    alert(`Cálculo guardado. Cliente será notificado para aprobar.`);
    
    // Cerrar modal
    setSelectedRequest(null);
    setCalculatedValues({ base: "", commission: "", total: "" });
  };

  const handleEmitInvoice = (request: RechargeRequest) => {
    // Validar que la solicitud esté aprobada por el cliente
    if (request.status !== "APPROVED_BY_CLIENT") {
      alert("La solicitud debe estar aprobada por el cliente antes de emitir factura");
      return;
    }
    
    // Simular emisión de factura
    const invoiceNumber = `AND-${Date.now()}`;
    
    const updatedRequests = requests.map(req => {
      if (req.id === request.id) {
        return {
          ...req,
          status: "INVOICED" as BillingStatus,
          invoiceNumber,
          invoicedAt: new Date(),
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    
    // Actualizar métricas
    setMetrics(prev => ({
      ...prev,
      pendingInvoices: prev.pendingInvoices - 1,
      pendingPayments: prev.pendingPayments + 1,
    }));
    
    console.log("✅ Factura emitida:", invoiceNumber);
    alert(`Factura ${invoiceNumber} emitida correctamente`);
  };

  const handleRegisterPayment = (request: RechargeRequest) => {
    if (request.status !== "INVOICED") {
      alert("Solo se puede registrar pago para facturas emitidas");
      return;
    }
    
    const updatedRequests = requests.map(req => {
      if (req.id === request.id) {
        return {
          ...req,
          status: "PAID" as BillingStatus,
          paidAt: new Date(),
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    
    setMetrics(prev => ({
      ...prev,
      pendingPayments: prev.pendingPayments - 1,
      pendingRecharges: prev.pendingRecharges + 1,
    }));
    
    console.log("✅ Pago registrado para:", request.id);
    alert("Pago registrado correctamente");
  };

  const handleExecuteRecharge = (request: RechargeRequest) => {
    if (request.status !== "PAID") {
      alert("Solo se puede ejecutar recarga para solicitudes pagadas");
      return;
    }
    
    const updatedRequests = requests.map(req => {
      if (req.id === request.id) {
        return {
          ...req,
          status: "RECHARGE_EXECUTED" as BillingStatus,
          rechargeExecutedAt: new Date(),
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    
    setMetrics(prev => ({
      ...prev,
      pendingRecharges: prev.pendingRecharges - 1,
    }));
    
    console.log("✅ Recarga ejecutada para:", request.id);
    alert(`Recarga ejecutada en ${request.platform}`);
  };

  const handleCompleteProcess = (request: RechargeRequest) => {
    if (request.status !== "RECHARGE_EXECUTED") {
      alert("Solo se pueden completar procesos con recarga ejecutada");
      return;
    }
    
    const updatedRequests = requests.map(req => {
      if (req.id === request.id) {
        return {
          ...req,
          status: "COMPLETED" as BillingStatus,
          completedAt: new Date(),
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    
    setMetrics(prev => ({
      ...prev,
      completedThisMonth: prev.completedThisMonth + 1,
      totalRevenue: prev.totalRevenue + (request.calculatedTotal || 0),
    }));
    
    console.log("✅ Proceso completado:", request.id);
    alert("Proceso marcado como completado");
  };

  if (!user || !isAdmin(user)) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Panel Admin AND
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Gestión de Facturación Local
            </p>
          </div>
          <button
            onClick={() => router.push("/landing")}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Métricas Admin */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <AdminMetricCard
            icon={<Clock size={20} weight="duotone" />}
            label="Pendientes Calcular"
            value={metrics.pendingRequests}
            color="orange"
          />
          <AdminMetricCard
            icon={<Calculator size={20} weight="duotone" />}
            label="Pendientes Aprobar"
            value={metrics.pendingApprovals}
            color="yellow"
          />
          <AdminMetricCard
            icon={<Receipt size={20} weight="duotone" />}
            label="Pendientes Facturar"
            value={metrics.pendingInvoices}
            color="blue"
          />
          <AdminMetricCard
            icon={<CurrencyDollar size={20} weight="duotone" />}
            label="Pendientes Pago"
            value={metrics.pendingPayments}
            color="purple"
          />
          <AdminMetricCard
            icon={<CheckCircle size={20} weight="duotone" />}
            label="Completadas (mes)"
            value={metrics.completedThisMonth}
            color="green"
          />
          <AdminMetricCard
            icon={<CurrencyDollar size={20} weight="duotone" />}
            label="Ingresos Totales"
            value={formatCurrency(metrics.totalRevenue)}
            color="green"
            small
          />
        </div>

        {/* Lista de solicitudes por estado */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Solicitudes Activas</h3>
          
          <div className="space-y-3">
            {requests.map(request => (
              <div key={request.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {request.platform} - {formatCurrency(request.requestedAmount)}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    ID: {request.id} | Estado: {request.status}
                  </p>
                </div>

                {request.status === "REQUEST_CREATED" && (
                  <button
                    onClick={() => handleCalculate(request)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Calcular
                  </button>
                )}

                {request.status === "CALCULATED" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Total: {formatCurrency(request.calculatedTotal || 0)}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
                      Esperando cliente
                    </span>
                  </div>
                )}

                {request.status === "APPROVED_BY_CLIENT" && (
                  <button
                    onClick={() => handleEmitInvoice(request)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Emitir Factura
                  </button>
                )}

                {request.status === "INVOICED" && (
                  <button
                    onClick={() => handleRegisterPayment(request)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Registrar Pago
                  </button>
                )}

                {request.status === "PAID" && (
                  <button
                    onClick={() => handleExecuteRecharge(request)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Ejecutar Recarga
                  </button>
                )}

                {request.status === "RECHARGE_EXECUTED" && (
                  <button
                    onClick={() => handleCompleteProcess(request)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Completar
                  </button>
                )}

                {request.status === "COMPLETED" && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                    ✓ Completado
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal de cálculo */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Calcular Valores - {selectedRequest.platform}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Monto solicitado: {formatCurrency(selectedRequest.requestedAmount)}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                    Base
                  </label>
                  <input
                    type="number"
                    value={calculatedValues.base}
                    onChange={(e) => setCalculatedValues({ ...calculatedValues, base: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                    Comisión
                  </label>
                  <input
                    type="number"
                    value={calculatedValues.commission}
                    onChange={(e) => setCalculatedValues({ ...calculatedValues, commission: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                    Total
                  </label>
                  <input
                    type="number"
                    value={calculatedValues.total}
                    onChange={(e) => setCalculatedValues({ ...calculatedValues, total: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveCalculation}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Guardar Cálculo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

interface AdminMetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: "orange" | "yellow" | "blue" | "purple" | "green";
  small?: boolean;
}

function AdminMetricCard({ icon, label, value, color, small }: AdminMetricCardProps) {
  const colorClasses = {
    orange: "bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
    yellow: "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    blue: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
    green: "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{label}</p>
      <p className={`font-bold text-slate-900 dark:text-white ${small ? 'text-sm' : 'text-xl'}`}>
        {value}
      </p>
    </div>
  );
}
