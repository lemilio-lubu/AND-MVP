"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUser } from "@/lib/context/UserContext";
import { 
  formatCurrency
} from "@/lib/billing";
import { 
  getAllFacturacionRequests,
  invoiceFacturacionRequest,
  markFacturacionAsPaid,
  completeFacturacionRequest,
  FacturacionRequest
} from "@/lib/api/client";
import { 
  Clock, 
  CheckCircle, 
  Receipt, 
  CurrencyDollar,
  Warning,
  Calculator,
  TrendUp,
  ChartPieSlice,
  Users,
  GlobeHemisphereWest
} from "@phosphor-icons/react";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading, logout } = useUser();
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<FacturacionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<FacturacionRequest | null>(null);
  const [showCalculateModal, setShowCalculateModal] = useState(false);
  const [calculatedValues, setCalculatedValues] = useState({
    base: "",
    commission: "",
    total: "",
  });

  // Calculate metrics from real data
  const metrics = {
    pendingRequests: requests.filter(r => r.estado === "REQUEST_CREATED").length,
    pendingApprovals: requests.filter(r => r.estado === "CALCULATED").length,
    pendingInvoices: requests.filter(r => r.estado === "APPROVED_BY_CLIENT").length,
    pendingPayments: requests.filter(r => r.estado === "INVOICED").length,
    pendingRecharges: requests.filter(r => r.estado === "PAID").length,
    completedThisMonth: requests.filter(r => 
      r.estado === "COMPLETED" && 
      new Date(r.created_at).getMonth() === new Date().getMonth()
    ).length,
    totalRevenue: requests
      .filter(r => r.estado === "COMPLETED")
      .reduce((sum, r) => sum + (r.total_facturado || 0), 0),
  };

  useEffect(() => {
    if (userLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.type !== "admin") {
      router.push("/dashboard");
      return;
    }

    loadData();
  }, [user, userLoading, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllFacturacionRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = (request: FacturacionRequest) => {
    // Nota: En el backend, el cálculo se hace automáticamente al crear la solicitud
    // y cambia el estado a CALCULATED. Este botón es informativo.
    alert("El backend ya calculó los valores automáticamente. Estado: CALCULATED");
  };



  const handleEmitInvoice = async (request: FacturacionRequest) => {
    if (request.estado !== "APPROVED_BY_CLIENT") {
      alert("La solicitud debe estar aprobada por el cliente antes de emitir factura");
      return;
    }
    
    try {
      await invoiceFacturacionRequest(request.id);
      await loadData();
      alert("Factura emitida correctamente");
    } catch (error: any) {
      console.error("Error emitting invoice:", error);
      alert(error.message || "Error al emitir factura");
    }
  };

  const handleRegisterPayment = async (request: FacturacionRequest) => {
    if (request.estado !== "INVOICED") {
      alert("Solo se puede registrar pago para facturas emitidas");
      return;
    }
    
    try {
      await markFacturacionAsPaid(request.id);
      await loadData();
      alert("Pago registrado correctamente");
    } catch (error: any) {
      console.error("Error registering payment:", error);
      alert(error.message || "Error al registrar pago");
    }
  };

  const handleExecuteRecharge = async (request: FacturacionRequest) => {
    if (request.estado !== "PAID") {
      alert("Solo se puede ejecutar recarga para solicitudes pagadas");
      return;
    }
    
    // Nota: Este endpoint aún no existe en el backend
    // Por ahora, usar completeFacturacionRequest directamente
    try {
      await completeFacturacionRequest(request.id);
      await loadData();
      alert(`Recarga ejecutada en ${request.plataforma}`);
    } catch (error: any) {
      console.error("Error executing recharge:", error);
      alert(error.message || "Error al ejecutar recarga");
    }
  };

  const handleCompleteProcess = async (request: FacturacionRequest) => {
    if (request.estado !== "RECHARGE_EXECUTED" && request.estado !== "PAID") {
      alert("Solo se pueden completar procesos con recarga ejecutada o pagados");
      return;
    }
    
    try {
      await completeFacturacionRequest(request.id);
      await loadData();
      alert("Proceso marcado como completado");
    } catch (error: any) {
      console.error("Error completing process:", error);
      alert(error.message || "Error al completar proceso");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/landing");
  };

  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (user.type !== "admin") {
    return null;
  }

  // Mock data for charts
  const revenueData = [
    { name: 'Lun', amount: 15000 },
    { name: 'Mar', amount: 25000 },
    { name: 'Mié', amount: 18000 },
    { name: 'Jue', amount: 32000 },
    { name: 'Vie', amount: 28000 },
    { name: 'Sáb', amount: 12000 },
    { name: 'Dom', amount: 9000 },
  ];

  const platformData = [
    { name: 'Meta', value: 45, color: '#3b82f6' },
    { name: 'Google', value: 30, color: '#10b981' },
    { name: 'TikTok', value: 15, color: '#000000' }, // Dark/Light handled in component
    { name: 'LinkedIn', value: 10, color: '#6366f1' },
  ];

  const getActionButtons = (request: FacturacionRequest) => {
      switch (request.estado) {
          case "REQUEST_CREATED":
            return (
              <button onClick={() => handleCalculate(request)} className="px-3 py-1.5 bg-accent hover:bg-primary text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-accent/30">
                Calcular
              </button>
            );
          case "CALCULATED":
            return (
               <span className="text-xs font-medium text-slate-400 italic">Esperando aprobación del cliente...</span>
            );
          case "APPROVED_BY_CLIENT":
             return (
              <button onClick={() => handleEmitInvoice(request)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-emerald-500/30">
                Emitir Factura
              </button>
            );
          case "INVOICED":
            return (
              <button onClick={() => handleRegisterPayment(request)} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-purple-500/30">
                Registrar Pago
              </button>
            );
           case "PAID":
            return (
              <button onClick={() => handleExecuteRecharge(request)} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-orange-500/30">
                Ejecutar Recarga
              </button>
            );
           case "RECHARGE_EXECUTED":
            return (
              <button onClick={() => handleCompleteProcess(request)} className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-teal-500/30">
                Finalizar
              </button>
            );
           default:
             return null;
      }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      {/* Header */}
      <header className="bg-transparent px-6 py-6 mb-2">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pages / Admin</p>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Panel de Administración
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <span className="px-3 py-1 bg-accent/10 dark:bg-accent/20 text-accent dark:text-[#4ADE80] text-xs font-bold rounded-full border border-accent/20 dark:border-accent/30 flex items-center gap-2">
                <CheckCircle weight="fill" />
                ADMINISTRADOR
              </span>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-4 py-2"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 space-y-8">
        {/* Métricas Admin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SoftMetricCard
            title="Ingresos Totales"
            value={formatCurrency(metrics.totalRevenue)}
            percentage="+12%"
            icon={<CurrencyDollar size={24} weight="fill" color="#fff" />}
            gradient="from-primary to-accent"
          />
          <SoftMetricCard
            title="Pendientes Acción"
            value={(metrics.pendingRequests + metrics.pendingApprovals).toString()}
            percentage="Atención"
            icon={<Warning size={24} weight="fill" color="#fff" />}
            gradient="from-primary to-accent"
          />
          <SoftMetricCard
            title="Pendientes Facturar"
            value={metrics.pendingInvoices.toString()}
            percentage="Prioridad"
            icon={<Receipt size={24} weight="fill" color="#fff" />}
            gradient="from-primary to-accent"
          />
           <SoftMetricCard
            title="Completadas (Mes)"
            value={metrics.completedThisMonth.toString()}
            percentage="+8%"
            icon={<CheckCircle size={24} weight="fill" color="#fff" />}
            gradient="from-primary to-accent"
          />
        </div>

        {/* Row 2: Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Trend - 8 cols */}
          <div className="lg:col-span-8 bg-[var(--surface)] dark:bg-surface/40 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-primary/20 text-[var(--text-main)] dark:text-white">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Flujo de Ingresos</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Últimos 7 días</p>
              </div>
              <div className="flex gap-2 items-center">
                 <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400">
                    Semanal
                 </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                   <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke={resolvedTheme === 'dark' ? "#334155" : "#e2e8f0"} 
                  />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff', 
                      borderColor: resolvedTheme === 'dark' ? '#334155' : '#e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: resolvedTheme === 'dark' ? '#fff' : '#0f172a' }}
                    labelStyle={{ color: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Distribution - 4 cols */}
          <div className="lg:col-span-4 bg-[var(--surface)] dark:bg-surface/40 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-primary/20 text-[var(--text-main)] dark:text-white">
            <div className="mb-6">
                <h3 className="font-bold text-lg">Distribución</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Solicitudes por plataforma</p>
            </div>
            <div className="h-[300px] w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ 
                      backgroundColor: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff', 
                      borderColor: resolvedTheme === 'dark' ? '#334155' : '#e2e8f0',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: resolvedTheme === 'dark' ? '#fff' : '#0f172a' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-30">
                 <Users size={40} weight="duotone" className="text-slate-400 dark:text-slate-600" />
              </div>
            </div>
             <div className="flex flex-wrap gap-2 justify-center mt-2">
                {platformData.map((p) => (
                  <div key={p.name} className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                    {p.name}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Lista de solicitudes por estado */}
        <div className="bg-[var(--surface)] dark:bg-surface/40 border border-slate-200 dark:border-primary/20 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="font-bold text-lg text-[var(--text-main)] dark:text-white">Gestión de Operaciones</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">
                 {metrics.pendingRequests + metrics.pendingApprovals + metrics.pendingInvoices} tareas pendientes
               </p>
            </div>
             <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-accent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <ChartPieSlice size={20} />
                </button>
             </div>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Cargando solicitudes...</p>
              </div>
            ) : requests.length > 0 ? (
              requests.map(request => (
                <div key={request.id} className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-accent/30 transition-all duration-200">
                  
                  {/* Icon Column */}
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                     {getPlatformIcon(request.plataforma)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                        {request.empresa_id} <span className="text-slate-400 font-normal mx-1">•</span> {request.plataforma}
                      </h4>
                      {request.estado === "COMPLETED" && (
                         <CheckCircle size={14} weight="fill" className="text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{request.id}</span>
                      <span>{formatDate(request.created_at)}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="w-full md:w-auto flex justify-between md:block items-center">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyle(request.estado)}`}>
                        {getStatusLabel(request.estado)}
                     </span>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                     <p className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(request.monto_solicitado)}
                     </p>
                     {request.total_facturado && (
                       <p className="text-xs text-slate-500 dark:text-slate-400">
                          Total: {formatCurrency(request.total_facturado)}
                       </p>
                     )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full md:w-auto justify-end mt-2 md:mt-0">
                      {getActionButtons(request)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                 <CheckCircle size={40} className="mx-auto mb-3 opacity-20" />
                 <p>No hay solicitudes</p>
              </div>
            )}
          </div>
        </div>

        {/* Nota: Modal de cálculo eliminado - backend calcula automáticamente */}
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

// --- Components & Helpers ---

function SoftMetricCard({ title, value, percentage, icon, gradient }: { title: string, value: string, percentage: string, icon: React.ReactNode, gradient: string }) {
  return (
    <div className="bg-[var(--surface)] dark:bg-surface/40 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-primary/20 relative overflow-hidden group hover:border-[var(--accent)]/30 transition-all duration-300">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h4>
            <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{percentage}</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-300 text-white shadow-accent/20`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function getPlatformIcon(platform: string) {
    // You can replace with specialized icons if available
    return <GlobeHemisphereWest weight="duotone" className="text-accent" size={20} />; 
}

function getStatusStyle(status: string) {
  const map: Record<string, string> = {
    REQUEST_CREATED: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    CALCULATED: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    APPROVED_BY_CLIENT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    INVOICED: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    PAID: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
    RECHARGE_EXECUTED: "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400",
    COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
  };
  return map[status] || "bg-slate-100 text-slate-600";
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    REQUEST_CREATED: "Revisión",
    CALCULATED: "Calculado",
    APPROVED_BY_CLIENT: "Aprobado",
    INVOICED: "Facturado",
    PAID: "Pagado",
    RECHARGE_EXECUTED: "Recargado",
    COMPLETED: "Completado"
  };
  return map[status] || status;
}

function formatDate(date?: Date | string) {
    if(!date) return "";
    return new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
}

