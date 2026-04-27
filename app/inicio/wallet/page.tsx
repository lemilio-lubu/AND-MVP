"use client";

import { ArrowUp, ArrowDown, TiktokLogo, FacebookLogo } from "@phosphor-icons/react";

export default function WalletPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      
      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Saldo Disponible (Left Column, Tall Card) */}
        <div className="bg-[#183626] border border-[#1E4D36] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden h-full min-h-[280px]">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1E4D36] rounded-full blur-[80px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <p className="text-[#A1B0AB] text-xs font-bold tracking-wider mb-2">SALDO DISPONIBLE</p>
            <h2 className="text-white text-5xl font-bold mb-2 tracking-tight">$3.210,75</h2>
            <p className="text-[#5F6D68] text-sm">USD · Actualizado hace 2 min</p>
          </div>
          
          <div className="relative z-10 mt-12">
            <button 
              onClick={() => window.open("https://tally.so/r/KYL7KM?id_cliente=CLI-002", "_blank")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#4ADE80] font-medium text-sm hover:bg-[#4ADE80]/20 transition-colors"
            >
              <span className="text-lg leading-none">+</span> Recargar saldo
            </button>
          </div>
        </div>

        {/* Right Columns (Metrics) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Invertido */}
            <div className="bg-[#131716] border border-[#1E2322] rounded-2xl p-6">
              <p className="text-[#5F6D68] text-xs font-bold tracking-wider mb-2">TOTAL INVERTIDO</p>
              <h3 className="text-white text-3xl font-bold mb-2">$11.170,50</h3>
              <p className="text-[#4ADE80] text-sm flex items-center gap-1 font-medium">
                <ArrowUp size={14} weight="bold" />
                10.2% <span className="text-[#5F6D68] font-normal">vs mes anterior</span>
              </p>
            </div>

            {/* Punto de Arrastre */}
            <div className="bg-[#131716] border border-[#1E2322] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <p className="text-[#5F6D68] text-xs font-bold tracking-wider mb-2">PUNTO DE ARRASTRE</p>
                <h3 className="text-white text-3xl font-bold mb-4">$1,200</h3>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#A1B0AB]">Consumido</span>
                  <span className="text-amber-500 font-bold">68%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1E2322] rounded-full overflow-hidden">
                  <div className="h-full w-[68%] bg-gradient-to-r from-[#4ADE80] to-amber-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Campañas Activas */}
          <div className="bg-[#131716] border border-[#1E2322] rounded-2xl p-6 flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <p className="text-[#5F6D68] text-xs font-bold tracking-wider">CAMPAÑAS ACTIVAS</p>
              <button className="text-[#A1B0AB] text-xs border border-[#1E2322] px-3 py-1.5 rounded-lg hover:text-white transition-colors">
                Ver todas →
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="text-white text-4xl font-bold mb-1">8</h4>
                <p className="text-[#5F6D68] text-sm font-medium">Total</p>
              </div>
              <div>
                <h4 className="text-amber-500 text-4xl font-bold mb-1">3</h4>
                <p className="text-[#5F6D68] text-sm font-medium">TikTok</p>
              </div>
              <div>
                <h4 className="text-blue-500 text-4xl font-bold mb-1">5</h4>
                <p className="text-[#5F6D68] text-sm font-medium">Facebook</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Plataformas (Left Column) */}
        <div className="space-y-4">
          <p className="text-[#5F6D68] text-xs font-bold tracking-wider mb-2">PLATAFORMAS</p>
          
          <div className="bg-[#131716] border border-[#1E2322] rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white border border-[#2D3331]">
                <TiktokLogo size={20} weight="fill" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">TikTok Ads</p>
                <p className="text-[#5F6D68] text-xs">3 campañas activas</p>
              </div>
            </div>
            <h3 className="text-white text-2xl font-bold mb-1">$4.850,00</h3>
            <p className="text-[#4ADE80] text-xs flex items-center gap-1 font-medium">
              <ArrowUp size={12} weight="bold" />
              12.4% <span className="text-[#5F6D68] font-normal">este mes</span>
            </p>
          </div>

          <div className="bg-[#131716] border border-[#1E2322] rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <FacebookLogo size={20} weight="fill" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Facebook Ads</p>
                <p className="text-[#5F6D68] text-xs">5 campañas activas</p>
              </div>
            </div>
            <h3 className="text-white text-2xl font-bold mb-1">$6.320,50</h3>
            <p className="text-[#4ADE80] text-xs flex items-center gap-1 font-medium">
              <ArrowUp size={12} weight="bold" />
              8.1% <span className="text-[#5F6D68] font-normal">este mes</span>
            </p>
          </div>
        </div>

        {/* Movimientos (Right Columns) */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-4">
            <p className="text-[#5F6D68] text-xs font-bold tracking-wider">MOVIMIENTOS</p>
            <button className="text-[#A1B0AB] text-xs hover:text-white transition-colors">
              Ver todos
            </button>
          </div>
          
          <div className="bg-[#131716] border border-[#1E2322] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E2322]">
                  <th className="text-left text-[#5F6D68] text-[10px] font-bold tracking-wider py-3 px-6 w-full">DESCRIPCIÓN</th>
                  <th className="text-right text-[#5F6D68] text-[10px] font-bold tracking-wider py-3 px-6">MONTO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2322]">
                {[
                  { title: "Tarjeta **** 4521", date: "Abr 22, 2026", amount: "+$2.000,00", type: "in" },
                  { title: "TikTok – Black Friday Promo", date: "Abr 21, 2026", amount: "-$480,00", type: "out" },
                  { title: "Facebook – Spring Sale", date: "Abr 20, 2026", amount: "-$720,00", type: "out" },
                  { title: "Transferencia bancaria", date: "Abr 18, 2026", amount: "+$5.000,00", type: "in" },
                  { title: "Facebook – Retargeting Q2", date: "Abr 17, 2026", amount: "-$1.100,00", type: "out" },
                ].map((tx, idx) => (
                  <tr key={idx} className="hover:bg-[#161B1A] transition-colors">
                    <td className="py-4 px-6 flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                        tx.type === "in" 
                          ? "bg-[#183626] border-[#1E4D36] text-[#4ADE80]" 
                          : "bg-[#3A1E1E] border-[#4D2828] text-[#F87171]"
                      }`}>
                        {tx.type === "in" ? <ArrowUp size={16} weight="bold" /> : <ArrowDown size={16} weight="bold" />}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{tx.title}</p>
                        <p className="text-[#5F6D68] text-xs">{tx.date}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`text-sm font-bold ${tx.type === "in" ? "text-[#4ADE80]" : "text-[#F87171]"}`}>
                        {tx.amount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
