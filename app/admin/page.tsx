"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
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

  const getActionButtons = (request: RechargeRequest) => {
      switch (request.status) {
          case "REQUEST_CREATED":
            return (
              <button onClick={() => handleCalculate(request)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-blue-500/30">
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
             <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full border border-purple-200 dark:border-purple-500/30 flex items-center gap-2">
                <CheckCircle weight="fill" />
                ADMINISTRADOR
              </span>
            <ThemeToggle />
            <button
              onClick={() => router.push("/landing")}
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
            gradient="from-blue-600 to-indigo-600"
          />
          <SoftMetricCard
            title="Pendientes Acción"
            value={(metrics.pendingRequests + metrics.pendingApprovals).toString()}
            percentage="Atención"
            icon={<Warning size={24} weight="fill" color="#fff" />}
            gradient="from-blue-600 to-indigo-600"
          />
          <SoftMetricCard
            title="Pendientes Facturar"
            value={metrics.pendingInvoices.toString()}
            percentage="Prioridad"
            icon={<Receipt size={24} weight="fill" color="#fff" />}
            gradient="from-blue-600 to-indigo-600"
          />
           <SoftMetricCard
            title="Completadas (Mes)"
            value={metrics.completedThisMonth.toString()}
            percentage="+8%"
            icon={<CheckCircle size={24} weight="fill" color="#fff" />}
            gradient="from-blue-600 to-indigo-600"
          />
        </div>

        {/* Row 2: Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Trend - 8 cols */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
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
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="font-bold text-lg text-slate-900 dark:text-white">Gestión de Operaciones</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">
                 {metrics.pendingRequests + metrics.pendingApprovals + metrics.pendingInvoices} tareas pendientes
               </p>
            </div>
             <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <ChartPieSlice size={20} />
                </button>
             </div>
          </div>
          
          <div className="space-y-4">
            {requests.map(request => (
              <div key={request.id} className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500/30 transition-all duration-200">
                
                {/* Icon Column */}
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                   {getPlatformIcon(request.platform)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                      {request.companyId} <span className="text-slate-400 font-normal mx-1">•</span> {request.platform}
                    </h4>
                    {request.status === "COMPLETED" && (
                       <CheckCircle size={14} weight="fill" className="text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{request.id}</span>
                    <span>{formatDate(request.createdAt)}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="w-full md:w-auto flex justify-between md:block items-center">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyle(request.status)}`}>
                      {getStatusLabel(request.status)}
                   </span>
                </div>

                {/* Amount */}
                <div className="text-right">
                   <p className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(request.requestedAmount)}
                   </p>
                   {request.calculatedTotal && (
                     <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total: {formatCurrency(request.calculatedTotal)}
                     </p>
                   )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full md:w-auto justify-end mt-2 md:mt-0">
                    {getActionButtons(request)}
                </div>
              </div>
            ))}
             
             {requests.length === 0 && (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                   <CheckCircle size={40} className="mx-auto mb-3 opacity-20" />
                   <p>No hay solicitudes pendientes</p>
                </div>
             )}
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

// --- Components & Helpers ---

function SoftMetricCard({ title, value, percentage, icon, gradient }: { title: string, value: string, percentage: string, icon: React.ReactNode, gradient: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h4>
            <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{percentage}</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-300 text-white shadow-blue-500/20`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function getPlatformIcon(platform: string) {
    // You can replace with specialized icons if available
    return <GlobeHemisphereWest weight="duotone" className="text-blue-500" size={20} />; 
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

function formatDate(date?: Date) {
    if(!date) return "";
    return new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
}

