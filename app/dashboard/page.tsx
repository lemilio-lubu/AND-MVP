"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUser } from "@/lib/context/UserContext";
import { 
  getUserTrajectory,
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
  Warning,
  ChartBar,
  ChartLineUp,
  GlobeHemisphereWest,
  CaretRight,
  User
} from "@phosphor-icons/react";
import { BillingRequestModal } from "@/app/components/BillingRequestModal";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { GlobalWorld } from "@/app/components/ui/GlobalWorld";
import { getDashboardStats, DashboardStats, approveFacturacionRequest, payFacturacionRequest, downloadInvoice } from "@/lib/api/client";

export default function DashboardPage() {
  const router = useRouter();
  const { user, refreshUser, loading: userLoading, logout } = useUser();
  const { resolvedTheme } = useTheme();
  const [showGamification, setShowGamification] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    console.log('📊 Dashboard: useEffect ejecutado. userLoading:', userLoading, 'user:', user);
    
    if (userLoading) return;
    
    if (!user) {
      console.log('⚠️ Dashboard: No hay usuario, redirigiendo a login');
      router.push("/login");
      return;
    }

    // Redirigir admin a su dashboard
    if (user.type === "admin") {
      console.log('🔀 Dashboard: Usuario admin, redirigiendo a /admin');
      router.push("/admin");
      return;
    }

    // Solo empresas pueden ver este dashboard
    if (user.type !== "empresa") {
      console.log('🔀 Dashboard: Usuario no es empresa, redirigiendo a /');
      router.push("/");
      return;
    }

    console.log('✅ Dashboard: Usuario válido, cargando datos...');
    // Determinar si mostrar gamificación
    const shouldShow = user.isNew && !user.hasEmittedFirstInvoice;
    setShowGamification(shouldShow);

    // Cargar datos reales
    loadData();
  }, [user, userLoading, router]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Cargando datos del dashboard...");
      const data = await getDashboardStats();
      console.log("Datos recibidos:", data);
      setStats(data);
    } catch (error: any) {
      console.error("Error loading dashboard stats:", error);
      setError("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await approveFacturacionRequest(requestId);
      await loadData();
      await refreshUser();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handlePay = async (requestId: string) => {
    try {
      if(!confirm("¿Confirmar simulación de pago?")) return;
      await payFacturacionRequest(requestId);
      await loadData();
      await refreshUser();
      alert("Pago realizado con éxito");
    } catch (error) {
      console.error("Error paying request:", error);
      alert("Error al realizar el pago");
    }
  };

  const handleDownload = async (requestId: string) => {
    try {
      await downloadInvoice(requestId);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Error al descargar factura");
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

  const trajectory = getUserTrajectory(stats?.summary.facturasEmitidas.value || 0, stats?.summary.totalFacturado.value || 0);

  // Charts data from API
  const chartData = stats?.charts.monthlyPerformance.map(item => ({
    name: item.month,
    billing: item.facturado,
    savings: item.ahorro
  })) || [];

  const lineChartData = stats?.charts.weeklyTrend || [];

  return (
    <main className="min-h-screen bg-[var(--background)] transition-colors duration-500 pb-20">
      {/* Navbar Minimalista */}
      <header className="bg-transparent px-6 py-6 mb-2">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pages / Dashboard</p>
            <h1 className="text-xl font-bold text-[var(--text-main)] dark:text-white mt-1">
              Panel Principal
            </h1>
          </div>
          <div className="flex items-center gap-4">
             {user.empresa?.ruc ? (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs font-bold rounded-full border border-green-200 dark:border-green-500/30">
                RUC: {user.empresa.ruc}
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-500/30">
                RUC PENDIENTE
              </span>
            )}
            <ThemeToggle />
            <button
              onClick={() => router.push("/perfil")}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] dark:hover:text-white transition-colors"
              title="Mi Perfil"
            >
              <User size={24} weight="duotone" />
            </button>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] dark:hover:text-white px-4 py-2"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-[var(--primary)] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-green-900/10 hover:bg-[var(--accent)] hover:scale-105 transition-all"
            >
              + Nueva Solicitud
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 space-y-8">

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Warning size={20} />
              <span>{error}</span>
            </div>
            <button 
              onClick={() => loadData()}
              className="text-sm font-bold underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}
        
        {/* Row 1: Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SoftMetricCard
            title="Total Facturado"
            value={formatCurrency(stats?.summary.totalFacturado.value || 0)}
            percentage={stats?.summary.totalFacturado.percentageChange ? `+${stats.summary.totalFacturado.percentageChange}%` : "0%"}
            icon={<CurrencyDollar size={24} weight="fill" color="#fff" />}
          />
          <SoftMetricCard
            title="Ahorro Fiscal"
            value={formatCurrency(stats?.summary.ahorroFiscal.value || 0)}
            percentage={stats?.summary.ahorroFiscal.percentageChange ? `+${stats.summary.ahorroFiscal.percentageChange}%` : "0%"}
            icon={<TrendUp size={24} weight="fill" color="#fff" />}
          />
          <SoftMetricCard
            title="Facturas Emitidas"
            value={(stats?.summary.facturasEmitidas.value || 0).toString()}
            percentage={stats?.summary.facturasEmitidas.percentageChange ? `+${stats.summary.facturasEmitidas.percentageChange}%` : "0%"}
            icon={<FileText size={24} weight="fill" color="#fff" />}
          />
          <SoftMetricCard
            title="Solicitudes Activas"
            value={(stats?.summary.solicitudesActivas.value || 0).toString()}
            percentage={stats?.summary.solicitudesActivas.percentageChange ? `+${stats.summary.solicitudesActivas.percentageChange}%` : "0%"}
            icon={<Rocket size={24} weight="fill" color="#fff" />}
          />
        </div>

        {/* Row 2: Tables & "Globe" Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Requests Table (Left - 7 cols) */}
          <div className="lg:col-span-7 bg-[var(--surface)] dark:bg-[#011F10]/40 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-[#04301C]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-[var(--text-main)] dark:text-white">Solicitudes Recientes</h3>
                <div className="flex items-center gap-2 text-sm text-[var(--accent)] font-medium mt-1">
                  <CheckCircle weight="fill" />
                  <span>{stats?.summary.solicitudesActivas.value || 0} solicitudes activas</span>
                </div>
              </div>
              <button 
                onClick={() => setShowRequestModal(true)}
                className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                title="Nueva Solicitud"
              >
                <CaretRight size={20} weight="bold" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-3 pl-2">Plataforma</th>
                    <th className="pb-3 text-center">Monto</th>
                    <th className="pb-3 text-center">Estado</th>
                    <th className="pb-3 text-right pr-2">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      </td>
                    </tr>
                  ) : (stats?.recentRequests?.length || 0) > 0 ? (
                    (stats?.recentRequests || []).slice(0, 5).map((request) => (
                      <tr key={request.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <GlobeHemisphereWest weight="duotone" />
                            </div>
                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                              {request.plataforma}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                            {formatCurrency(request.monto)}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${getStatusColor(request.estado)}`}>
                            {getStatusLabel(request.estado)}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-2">
                           {request.estado === "CALCULATED" ? (
                            <button 
                              onClick={() => handleApprove(request.id)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                            >
                              Aprobar
                            </button>
                          ) : request.estado === "INVOICED" ? (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleDownload(request.id)}
                                className="text-xs font-bold text-slate-600 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors"
                                title="Descargar Factura"
                              >
                                PDF
                              </button>
                              <button 
                                onClick={() => handlePay(request.id)}
                                className="text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors"
                              >
                                Pagar
                              </button>
                            </div>
                          ) : (['PAID', 'COMPLETED', 'RECHARGE_EXECUTED'].includes(request.estado)) ? (
                            <button 
                              onClick={() => handleDownload(request.id)}
                              className="text-xs font-bold text-slate-600 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors"
                            >
                              Descargar PDF
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-slate-400">Ver detalles</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">No hay solicitudes recientes</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* "Globe" / Network Area (Right - 5 cols) */}
          <div className="lg:col-span-5 relative overflow-hidden bg-[var(--surface)] dark:bg-[#011F10]/40 border border-slate-200 dark:border-[#04301C] rounded-2xl p-6 shadow-sm dark:shadow-xl text-[var(--text-main)] dark:text-white group">
            
            {/* Fondo decorativo sutil */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <GlobeHemisphereWest size={200} weight="fill" className="text-[var(--primary)] dark:text-white" />
            </div>

            {/* Globo Animado Central */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-60 scale-125 group-hover:scale-150 transition-transform duration-1000">
               <GlobalWorld size={400} />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between pointer-events-none">
              <div>
                <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">Red de Negocios</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[70%]">
                  Tu alcance global a través de AND.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Plataformas</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    {stats?.businessNetwork.activePlatforms || 0} Activas
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Países</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    {stats?.businessNetwork.regions || 1} Regiones
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-slate-500 mb-2 uppercase font-bold tracking-wider">Top Plataformas Globales</p>
                <div className="space-y-4">
                  {(stats?.businessNetwork.topPlatforms || []).map((platform, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-slate-700 dark:text-slate-200">{platform.name}</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{platform.percentage}%</span>
                      </div>
                      <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${index === 0 ? 'bg-blue-500' : 'bg-emerald-500'} w-[${platform.percentage}%]`} 
                          style={{ width: `${platform.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {(stats?.businessNetwork.topPlatforms?.length === 0) && (
                    <p className="text-xs text-slate-500 italic">No hay datos de plataformas aún</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Validated Billing (Left - 5 cols) */}
          <div className="lg:col-span-5 bg-[var(--surface)] dark:bg-[#011F10]/40 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-[#04301C] text-[var(--text-main)] dark:text-white min-w-0">
            <div className="mb-6">
              <h3 className="font-bold text-lg">Facturación vs Ahorro</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Rendimiento mensual</p>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff', 
                      borderColor: resolvedTheme === 'dark' ? '#334155' : '#e2e8f0',
                      borderWidth: '1px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: resolvedTheme === 'dark' ? '#fff' : '#0f172a' }}
                    labelStyle={{ color: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b' }}
                  />
                  <Bar 
                    dataKey="billing" 
                    fill={resolvedTheme === 'dark' ? "#fff" : "#0f172a"} 
                    radius={[4, 4, 0, 0]} 
                    barSize={20} 
                    name="Facturado" 
                  />
                  <Bar 
                    dataKey="savings" 
                    fill="#22c55e" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20} 
                    name="Ahorrado" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
               <p className="text-xs text-slate-500 dark:text-slate-400">
                 <strong className="text-green-500 font-bold">(+23%)</strong> más que el mes anterior
               </p>
            </div>
          </div>

          {/* Sales Comparison (Right - 7 cols) */}
          <div className="lg:col-span-7 bg-[var(--surface)] dark:bg-[#011F10]/40 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-[#04301C] min-w-0">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Tendencia de Solicitudes</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Evolución semanal</p>
              </div>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 block"></span>
                <span className="text-xs text-slate-500">Volumen</span>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineChartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6 " stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6 " stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      <BillingRequestModal 
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={() => loadData()}
      />
    </main>
  );
}

// --- Components ---

function SoftMetricCard({ title, value, percentage, icon }: { title: string, value: string, percentage: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface)] dark:bg-[#011F10]/40 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-[#04301C] relative overflow-hidden group hover:border-[var(--accent)]/30 transition-all duration-300">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-[var(--text-main)] dark:text-white mt-1">{value}</h4>
            <span className="text-xs font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">{percentage}</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] group-hover:scale-110 transition-transform duration-300 text-white shadow-green-900/20">
          {icon}
        </div>
      </div>
    </div>
  );
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    REQUEST_CREATED: "Revisión",
    CALCULATED: "Aprobación",
    APPROVED_BY_CLIENT: "Aprobado",
    INVOICED: "Facturado",
    PAID: "Pagado",
    RECHARGE_EXECUTED: "Recargado",
    COMPLETED: "Completado",
    ERROR: "Error"
  };
  return map[status] || status;
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    REQUEST_CREATED: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    CALCULATED: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    APPROVED_BY_CLIENT: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
    INVOICED: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    PAID: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400",
    RECHARGE_EXECUTED: "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400",
    COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    ERROR: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
  };
  return map[status] || "bg-slate-100 text-slate-600";
}
