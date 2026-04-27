"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wallet, SquaresFour, List, Bell, Circle } from "@phosphor-icons/react";
import { useUser } from "@/lib/context/UserContext";

export default function InicioLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();
  const [customName, setCustomName] = useState("");
  const [customLogo, setCustomLogo] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCustomName(localStorage.getItem("and_custom_name") || "");
      setCustomLogo(localStorage.getItem("and_custom_logo") || "");
    }
  }, []);

  const isWallet = pathname.includes("wallet");
  const isDashboard = pathname.includes("dashboard");

  const currentDate = new Intl.DateTimeFormat("es-ES", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const baseCompanyName = user?.empresa?.razon_social || user?.name || "Mi Facturacion";
  const displayCompanyName = customName || baseCompanyName;
  const avatarInitials = displayCompanyName.substring(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-[#0E1111] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1E2322] flex flex-col justify-between bg-[#0E1111] flex-shrink-0">
        <div>
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-[#1E2322]">
            <img src="/assets/logos-02.png" alt="AND Local Ads" className="h-8 object-contain" />
          </div>

          {/* Navigation */}
          <div className="px-4 py-6">
            <p className="text-[#5F6D68] text-xs font-bold tracking-wider mb-4 px-2">NAVIGATION</p>
            <nav className="space-y-1">
              <Link
                href="/inicio/wallet"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isWallet
                    ? "bg-[#183626] text-[#4ADE80] border border-[#1E4D36]"
                    : "text-[#A1B0AB] hover:text-white hover:bg-[#161B1A]"
                }`}
              >
                <Wallet size={20} weight={isWallet ? "fill" : "regular"} />
                Wallet
              </Link>
              <Link
                href="/inicio/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isDashboard
                    ? "bg-[#183626] text-[#4ADE80] border border-[#1E4D36]"
                    : "text-[#A1B0AB] hover:text-white hover:bg-[#161B1A]"
                }`}
              >
                <SquaresFour size={20} weight={isDashboard ? "fill" : "regular"} />
                Dashboard
              </Link>
            </nav>
          </div>
        </div>

        {/* User Profile Area */}
        <div className="p-4 border-t border-[#1E2322] cursor-pointer hover:bg-[#161B1A] transition-colors" onClick={() => router.push("/perfil")}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A3828] flex items-center justify-center text-[#4ADE80] font-bold text-sm border border-[#1E4D36] overflow-hidden">
              {customLogo ? (
                <img src={customLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                avatarInitials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{displayCompanyName}</p>
              <p className="text-xs text-[#A1B0AB] truncate">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 border-b border-[#1E2322] flex items-center justify-between px-8 bg-[#0E1111] flex-shrink-0">
          <div className="flex items-center gap-6">
            <button className="text-[#A1B0AB] hover:text-white transition-colors">
              <List size={24} />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-[#5F6D68] text-sm font-medium">ADPRO</span>
              <span className="text-[#5F6D68] text-sm">/</span>
              <span className="text-white text-sm font-bold">
                {isWallet ? "Wallet" : isDashboard ? "Dashboard" : ""}
              </span>
              <span className="text-[#5F6D68] text-sm ml-4 border-l border-[#1E2322] pl-4">
                {isWallet ? "Saldo, inversiones por plataforma y recargas" : "Vista consolidada del rendimiento de campañas"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1E4D36] bg-[#0E2016]">
              <Circle size={8} weight="fill" className="text-[#4ADE80] animate-pulse" />
              <span className="text-[#4ADE80] text-xs font-semibold">En vivo</span>
            </div>
            <button className="text-[#A1B0AB] hover:text-white transition-colors relative">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full border border-[#0E1111]"></span>
            </button>
            <div className="px-4 py-2 rounded-lg border border-[#1E2322] bg-[#161B1A]">
              <span className="text-[#A1B0AB] text-sm capitalize">{currentDate}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto bg-[#0E1111]">
          {children}
        </main>
      </div>
    </div>
  );
}
