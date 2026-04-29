"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wallet, SquaresFour, List, Bell, Circle, X } from "@phosphor-icons/react";
import { useUser } from "@/lib/context/UserContext";

export default function InicioLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();
  const [customName, setCustomName] = useState("");
  const [customLogo, setCustomLogo] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-[#0E1111] text-white font-sans overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 border-r border-[#1E2322] flex flex-col justify-between bg-[#0E1111] flex-shrink-0 z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div>
          {/* Logo Area */}
          <div className="h-24 flex items-center justify-between lg:justify-center px-4 border-b border-[#1E2322]">
            <img src="/assets/localadspng-11.png" alt="AND Local Ads" className="h-12 w-auto object-contain p-2" />
            <button 
              className="lg:hidden text-[#A1B0AB] hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
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
            <div className="w-10 h-10 rounded-full bg-[#1A3828] flex items-center justify-center text-[#4ADE80] font-bold text-sm border border-[#1E4D36] overflow-hidden flex-shrink-0">
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-auto min-h-[5rem] py-4 lg:py-0 lg:h-20 border-b border-[#1E2322] flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 lg:px-8 bg-[#0E1111] flex-shrink-0 gap-4">
          <div className="flex items-center gap-3 lg:gap-6 w-full sm:w-auto">
            <button 
              className="lg:hidden text-[#A1B0AB] hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <List size={24} />
            </button>
            <div className="hidden lg:flex items-center text-[#A1B0AB] hover:text-white transition-colors opacity-50 cursor-not-allowed">
              <List size={24} />
            </div>
            <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
              <span className="text-[#5F6D68] text-xs lg:text-sm font-medium">ADPRO</span>
              <span className="text-[#5F6D68] text-xs lg:text-sm">/</span>
              <span className="text-white text-xs lg:text-sm font-bold">
                {isWallet ? "Wallet" : isDashboard ? "Dashboard" : ""}
              </span>
              <span className="text-[#5F6D68] text-[10px] lg:text-sm ml-2 lg:ml-4 border-l border-[#1E2322] pl-2 lg:pl-4 hidden sm:inline-block">
                {isWallet ? "Saldo e inversiones" : "Vista de campañas"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-6 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full border border-[#1E4D36] bg-[#0E2016]">
              <Circle size={8} weight="fill" className="text-[#4ADE80] animate-pulse" />
              <span className="text-[#4ADE80] text-[10px] lg:text-xs font-semibold">En vivo</span>
            </div>
            <button className="text-[#A1B0AB] hover:text-white transition-colors relative">
              <Bell size={20} className="lg:w-6 lg:h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full border border-[#0E1111]"></span>
            </button>
            <div className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg border border-[#1E2322] bg-[#161B1A] hidden sm:block">
              <span className="text-[#A1B0AB] text-xs lg:text-sm capitalize">{currentDate}</span>
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
