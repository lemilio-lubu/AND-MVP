"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
  Warning,
  ChartBar,
  ChartLineUp,
  GlobeHemisphereWest,
  CaretRight
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const { resolvedTheme } = useTheme();
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
        {
          id: "req-3",
          companyId: user.id,
          platform: "Google",
          requestedAmount: 12000,
          status: "COMPLETED",
          createdAt: new Date(Date.now() - 86400000 * 5),
        } as RechargeRequest,
        {
          id: "req-4",
          companyId: user.id,
          platform: "Meta",
          requestedAmount: 8500,
          status: "COMPLETED",
          createdAt: new Date(Date.now() - 86400000 * 12),
        } as RechargeRequest,
      ]);
    }
  };

  if (!user) {
    return null;
  }

  const trajectory = getUserTrajectory(metrics.invoicesEmitted, metrics.totalBilledThisMonth);

  // Mock Data for Charts
  const chartData = [
    { name: 'Ene', billing: 4000, savings: 240 },
    { name: 'Feb', billing: 3000, savings: 139 },
    { name: 'Mar', billing: 2000, savings: 980 },
    { name: 'Abr', billing: 2780, savings: 390 },
    { name: 'May', billing: 1890, savings: 480 },
    { name: 'Jun', billing: 2390, savings: 380 },
    { name: 'Jul', billing: 3490, savings: 430 },
  ];

  const lineChartData = [
    { name: 'Sem 1', amount: 4000 },
    { name: 'Sem 2', amount: 3000 },
    { name: 'Sem 3', amount: 5000 },
    { name: 'Sem 4', amount: 2780 },
    { name: 'Sem 5', amount: 1890 },
    { name: 'Sem 6', amount: 2390 },
    { name: 'Sem 7', amount: 3490 },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      {/* Navbar Minimalista */}
      <header className="bg-transparent px-6 py-6 mb-2">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pages / Dashboard</p>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Panel Principal
            </h1>
          </div>
          <div className="flex items-center gap-4">
             {user.rucConnected ? (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs font-bold rounded-full border border-green-200 dark:border-green-500/30">
                RUC CONECTADO
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-500/30">
                RUC PENDIENTE
              </span>
            )}
            <ThemeToggle />
            <button
              onClick={() => router.push("/landing")}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-4 py-2"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 dark:shadow-none hover:scale-105 transition-transform"
            >
              + Nueva Solicitud
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 space-y-8">
        
        {/* Row 1: Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SoftMetricCard
            title="Total Facturado"
            value={formatCurrency(metrics.totalBilledThisMonth)}
            percentage="+55%"
            icon={<CurrencyDollar size={24} weight="fill" color="#fff" />}
          />
          <SoftMetricCard
            title="Ahorro Fiscal"
            value={formatCurrency(metrics.accumulatedTaxSavings)}
            percentage="+15%"
            icon={<TrendUp size={24} weight="fill" color="#fff" />}
          />
          <SoftMetricCard
            title="Facturas Emitidas"
            value={metrics.invoicesEmitted.toString()}
            percentage="+3%"
            icon={<FileText size={24} weight="fill" color="#fff" />}
          />
          <SoftMetricCard
            title="Solicitudes Activas"
            value={metrics.activeRequests.toString()}
            percentage="+5%"
            icon={<Rocket size={24} weight="fill" color="#fff" />}
          />
        </div>

        {/* Row 2: Tables & "Globe" Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Requests Table (Left - 7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Solicitudes Recientes</h3>
                <div className="flex items-center gap-2 text-sm text-green-500 font-medium mt-1">
                  <CheckCircle weight="fill" />
                  <span>{metrics.activeRequests} solicitudes activas</span>
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
                  {recentRequests.length > 0 ? (
                    recentRequests.map((request) => (
                      <tr key={request.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <GlobeHemisphereWest weight="duotone" />
                            </div>
                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                              {request.platform}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                            {formatCurrency(request.requestedAmount)}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                            {getStatusLabel(request.status)}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-2">
                           {request.status === "CALCULATED" ? (
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors">
                              Aprobar
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
          <div className="lg:col-span-5 relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl text-slate-900 dark:text-white group">
            
            {/* Fondo decorativo sutil */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <GlobeHemisphereWest size={200} weight="fill" className="text-slate-900 dark:text-white" />
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
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">4 Activas</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Países</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">2 Regiones</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-slate-500 mb-2 uppercase font-bold tracking-wider">Top Plataformas Globales</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-700 dark:text-slate-200">Meta Ads (Global)</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">45%</span>
                    </div>
                    <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[45%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-700 dark:text-slate-200">Google Ads (Latam)</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">30%</span>
                    </div>
                    <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[30%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Validated Billing (Left - 5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
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
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
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
        onSuccess={() => loadMockData()}
      />
    </main>
  );
}

// --- Components ---

function SoftMetricCard({ title, value, percentage, icon }: { title: string, value: string, percentage: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h4>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{percentage}</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 group-hover:scale-110 transition-transform duration-300 text-white shadow-blue-500/20">
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
    COMPLETED: "Completado"
  };
  return map[status] || status;
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    REQUEST_CREATED: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    CALCULATED: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
  };
  return map[status] || "bg-slate-100 text-slate-600";
}
