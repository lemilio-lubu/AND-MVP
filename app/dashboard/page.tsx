"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import { 
  shouldShowGamification, 
  getUserTrajectory,
  DashboardMetrics,
  RechargeRequest,
  formatCurrency 
} from "@/lib/billing";
import { 
  Receipt, 
  CurrencyDollar, 
  CheckCircle, 
  Clock, 
  Rocket,
  TrendUp,
  FileText,
  Warning
} from "@phosphor-icons/react";
import { BillingRequestModal } from "@/app/components/BillingRequestModal";

export default function DashboardPage() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [showGamification, setShowGamification] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalBilledThisMonth: 0,
    accumulatedTaxSavings: 0,
    invoicesEmitted: 0,
    invoicesPending: 0,
    activeRequests: 0,  // Ahora "solicitudes activas", no "campañas"
  });

  // Mock: datos de ejemplo para demostración
  const [recentRequests, setRecentRequests] = useState<RechargeRequest[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Redirigir admin a su dashboard
    if (user.type === "admin") {
      router.push("/admin");
      return;
    }

    // Solo empresas pueden ver este dashboard
    if (user.type !== "empresa") {
      router.push("/");
      return;
    }

    // Determinar si mostrar gamificación
    const shouldShow = shouldShowGamification(user);
    setShowGamification(shouldShow);

    // Mock: cargar métricas (en producción sería API call)
    loadMockData();
  }, [user, router]);

  const loadMockData = () => {
    if (!user) return;
    
    // Datos mock para demostración
    if (user.isNew) {
      // Usuario nuevo: sin datos aún
      setMetrics({
        totalBilledThisMonth: 0,
        accumulatedTaxSavings: 0,
        invoicesEmitted: 0,
        invoicesPending: 0,
        activeRequests: 0,
      });
      setRecentRequests([]);
    } else {
      // Usuario existente: con datos
      setMetrics({
        totalBilledThisMonth: 53000,
        accumulatedTaxSavings: 2650,
        invoicesEmitted: 12,
        invoicesPending: 0,
        activeRequests: 2,  // 2 solicitudes en proceso
      });
      
      // Mock: solicitudes recientes
      setRecentRequests([
        {
          id: "req-1",
          companyId: user.id,
          platform: "Meta",
          requestedAmount: 5000,
          status: "CALCULATED",
          calculatedTotal: 5275,
          createdAt: new Date(),
        } as RechargeRequest,
        {
          id: "req-2",
          companyId: user.id,
          platform: "TikTok",
          requestedAmount: 3000,
          status: "REQUEST_CREATED",
          createdAt: new Date(),
        } as RechargeRequest,
      ]);
    }
  };

  if (!user) {
    return null;
  }

  const trajectory = getUserTrajectory(metrics.invoicesEmitted, metrics.totalBilledThisMonth);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Facturación Local
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {user.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {showGamification && (
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-slate-600 dark:text-slate-400">Trayectoria</p>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 capitalize">
                  {trajectory.replace("-", " ")}
                </p>
              </div>
            )}
            <button
              onClick={() => router.push("/landing")}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Gamificación - Solo para usuarios nuevos */}
        {showGamification && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                <Rocket size={24} weight="duotone" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  ¡Bienvenido a AND! 🎉
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                  Tu trayectoria comienza aquí. Cada colaboración, entrega y conexión te impulsa a un nuevo nivel.
                </p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-2xl mb-1">🚀</div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">Iniciando</p>
                  </div>
                  <div className="text-center p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 opacity-50">
                    <div className="text-2xl mb-1">⚡</div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Confianza comprobada</p>
                  </div>
                  <div className="text-center p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 opacity-50">
                    <div className="text-2xl mb-1">⭐</div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Colaborador estrella</p>
                  </div>
                  <div className="text-center p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 opacity-50">
                    <div className="text-2xl mb-1">🤝</div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Socio estratégico</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Métricas principales - Específicas AND */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<CurrencyDollar size={24} weight="duotone" />}
            label="Total facturado (mes)"
            value={formatCurrency(metrics.totalBilledThisMonth)}
            color="blue"
          />
          <MetricCard
            icon={<TrendUp size={24} weight="duotone" />}
            label="Ahorro fiscal acumulado"
            value={formatCurrency(metrics.accumulatedTaxSavings)}
            color="green"
            trend="+15%"
          />
          <MetricCard
            icon={<CheckCircle size={24} weight="duotone" />}
            label="Facturas emitidas"
            value={metrics.invoicesEmitted.toString()}
            color="purple"
          />
          <MetricCard
            icon={<Clock size={24} weight="duotone" />}
            label="Facturas pendientes"
            value={metrics.invoicesPending.toString()}
            color="orange"
          />
        </div>

        {/* Sección de acciones principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Solicitar facturación */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Receipt size={20} weight="duotone" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Solicitar Facturación</h3>
            </div>
            
            {!user.rucConnected ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <Warning size={18} className="text-orange-600 dark:text-orange-400 mt-0.5" weight="duotone" />
                  <p className="text-xs text-orange-800 dark:text-orange-300">
                    Debes conectar tus datos tributarios (RUC) antes de solicitar facturación
                  </p>
                </div>
                <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">
                  Conectar RUC
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowRequestModal(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all text-sm shadow-lg shadow-blue-500/30"
              >
                Nueva Solicitud
              </button>
            )}
          </div>

          {/* Solicitudes activas (no "campañas") */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Clock size={20} weight="duotone" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white">Solicitudes en Proceso</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{metrics.activeRequests} activas</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors text-sm">
              Ver Solicitudes
            </button>
          </div>

          {/* Estado de facturación */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                <FileText size={20} weight="duotone" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Estado</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">RUC Conectado:</span>
                <span className={user.rucConnected ? "text-green-600 dark:text-green-400 font-medium" : "text-orange-600 dark:text-orange-400 font-medium"}>
                  {user.rucConnected ? "✓ Sí" : "Pendiente"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Primera Factura:</span>
                <span className={user.hasEmittedFirstInvoice ? "text-green-600 dark:text-green-400 font-medium" : "text-slate-600 dark:text-slate-400"}>
                  {user.hasEmittedFirstInvoice ? "✓ Emitida" : "Pendiente"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de solicitudes recientes */}
        {(metrics.activeRequests > 0 || recentRequests.length > 0) && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Solicitudes Recientes</h3>
            {recentRequests.length > 0 ? (
              <div className="space-y-3">
                {recentRequests.map(request => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {request.platform} - {formatCurrency(request.requestedAmount)}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {getStatusLabel(request.status)}
                      </p>
                    </div>
                    {request.status === "CALCULATED" && (
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        Aprobar
                      </button>
                    )}
                    {request.status === "REQUEST_CREATED" && (
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
                        En revisión
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <FileText size={48} weight="duotone" className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay solicitudes activas</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Solicitud de Facturación */}
      <BillingRequestModal 
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={() => loadMockData()}
      />
    </main>
  );
}

// Helper para mostrar labels de estados
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    REQUEST_CREATED: "Enviada - En revisión por AND",
    CALCULATED: "Calculada - Pendiente de tu aprobación",
    APPROVED_BY_CLIENT: "Aprobada - Emitiendo factura",
    INVOICED: "Factura emitida - Pendiente de pago",
    PAID: "Pagada - Ejecutando recarga",
    RECHARGE_EXECUTED: "Recarga ejecutada",
    COMPLETED: "Completada",
    ERROR: "Error - Contacta a soporte",
  };
  return labels[status] || status;
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "green" | "purple" | "orange";
  trend?: string;
}

function MetricCard({ icon, label, value, color, trend }: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="ml-auto text-xs font-semibold text-green-600 dark:text-green-400">
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
