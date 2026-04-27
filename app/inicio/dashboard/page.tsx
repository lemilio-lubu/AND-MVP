"use client";

import { useState, useEffect } from "react";
import { Globe, SquaresFour } from "@phosphor-icons/react";

export default function DashboardPage() {
  const [inputValue, setInputValue] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");

  // Recuperar iframe guardado en localStorage al montar
  useEffect(() => {
    const savedUrl = localStorage.getItem("and_dashboard_url");
    if (savedUrl) {
      setIframeUrl(savedUrl);
      setInputValue(savedUrl);
    }
  }, []);

  const handleCargar = () => {
    if (inputValue) {
      setIframeUrl(inputValue);
      localStorage.setItem("and_dashboard_url", inputValue);
    } else {
      setIframeUrl("");
      localStorage.removeItem("and_dashboard_url");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#090B0A] relative">
      {/* Subtle background grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      ></div>

      {/* Top Input Bar */}
      <div className="flex items-center gap-4 p-6 border-b border-[#1E2322] relative z-10">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6D68]">
            <Globe size={20} />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCargar()}
            placeholder="Pega el enlace de tu dashboard (Looker Studio, Metabase, Grafana...)"
            className="w-full bg-[#131716] border border-[#1E2322] text-white text-sm rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-[#4ADE80] transition-colors placeholder:text-[#5F6D68]"
          />
        </div>
        <button
          onClick={handleCargar}
          className="bg-[#4ADE80] hover:bg-[#34D399] text-[#0E1111] font-bold text-sm px-6 py-3 rounded-lg transition-colors"
        >
          Cargar
        </button>
        <div className="flex items-center bg-[#131716] border border-[#1E2322] rounded-lg p-1 ml-4">
          <button className="px-3 py-1.5 text-[#5F6D68] text-xs font-bold hover:text-white transition-colors">7D</button>
          <button className="px-3 py-1.5 bg-[#183626] text-[#4ADE80] rounded-md text-xs font-bold shadow-sm">30D</button>
          <button className="px-3 py-1.5 text-[#5F6D68] text-xs font-bold hover:text-white transition-colors">90D</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 p-6 overflow-hidden">
        {iframeUrl ? (
          <div className="w-full h-full bg-black rounded-xl border border-[#1E2322] overflow-hidden flex flex-col">
            <div className="bg-[#131716] border-b border-[#1E2322] px-4 py-2 flex items-center justify-between flex-shrink-0">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#F87171]"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                 <div className="w-3 h-3 rounded-full bg-[#4ADE80]"></div>
               </div>
               <span className="text-[#5F6D68] text-xs max-w-md truncate">{iframeUrl}</span>
               <div className="w-16"></div> {/* spacer */}
            </div>
            <iframe 
              src={iframeUrl} 
              className="w-full flex-1 border-0"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-[#131716] border border-[#1E4D36]/40 rounded-2xl p-10 max-w-md text-center relative overflow-hidden group">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#4ADE80] rounded-tl-sm"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#4ADE80] rounded-tr-sm"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#4ADE80] rounded-bl-sm"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#4ADE80] rounded-br-sm"></div>

              <div className="w-16 h-16 bg-[#183626] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#4ADE80]">
                <SquaresFour size={32} weight="fill" />
              </div>
              <h3 className="text-white text-lg font-bold mb-3">Sin dashboard conectado</h3>
              <p className="text-[#5F6D68] text-sm leading-relaxed">
                Pega el enlace de tu herramienta en la barra de arriba.<br/>
                Compatible con <span className="text-white font-medium">Looker Studio</span>, <span className="text-white font-medium">Metabase</span>, <span className="text-white font-medium">Grafana</span>, <span className="text-white font-medium">Tableau</span> y más.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
