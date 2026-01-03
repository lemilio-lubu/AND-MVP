"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Envelope, LockKey, SignIn, Buildings, Key } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { InputGroup } from "@/app/components/ui/InputGroup";
import { GradientButton } from "@/app/components/ui/GradientButton";
import { BackButton } from "@/app/components/ui/BackButton";
import { useUser } from "@/lib/context/UserContext";
import { User } from "@/lib/billing";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"empresa" | "admin">("empresa");

  const handleLogin = () => {
    // Mock: Simular login (en producción sería API call)
    
    // Credenciales especiales para Admin
    if (userType === "admin") {
      if (email === "admin@and.com" && password === "admin123") {
        const adminUser: User = {
          id: "admin-and-001",
          type: "admin",
          isNew: false,
          email: "admin@and.com",
          name: "Operador AND",
          rucConnected: true,
          hasEmittedFirstInvoice: true,
        };
        login(adminUser);
        router.push("/admin");
      } else {
        alert("Credenciales de admin incorrectas");
      }
      return;
    }
    
    // Login normal para empresa
    const mockUser: User = {
      id: "existing-user-123",
      type: "empresa",
      isNew: false, // Usuario existente
      email: email || "empresa@example.com",
      name: "Empresa Demo",
      rucConnected: true,
      hasEmittedFirstInvoice: true,
    };

    login(mockUser);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] w-[50%] h-[50%] bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <BackButton />

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mb-4 shadow-inner">
              <SignIn size={32} weight="duotone" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bienvenido de nuevo</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Accede a tu panel de control</p>
          </div>

          <div className="space-y-6">
            {/* Selector de tipo de usuario */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Tipo de acceso
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("empresa")}
                  className={`px-4 py-3 rounded-xl border-2 transition-all ${
                    userType === "empresa"
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex justify-center mb-1"><Buildings size={32} weight="duotone" /></div>
                  <div className="text-sm font-medium">Empresa</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("admin")}
                  className={`px-4 py-3 rounded-xl border-2 transition-all ${
                    userType === "admin"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex justify-center mb-1"><Key size={32} weight="duotone" /></div>
                  <div className="text-sm font-medium">Admin AND</div>
                </button>
              </div>
            </div>

            <InputGroup 
              label="Correo Electrónico"
              icon={<Envelope size={18} />}
              placeholder={userType === "admin" ? "admin@and.com" : "tu@email.com"}
              theme="blue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="space-y-1">
              <InputGroup 
                label="Contraseña"
                icon={<LockKey size={18} />}
                placeholder="••••••••"
                type="password"
                theme="blue"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {userType === "empresa" && (
                <div className="text-right">
                  <Link href="#" className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              )}
            </div>

            {userType === "admin" && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Demo:</strong> admin@and.com / admin123
                </p>
              </div>
            )}

            <GradientButton 
              onClick={handleLogin}
              theme="blue"
              className="mt-8"
            >
              {userType === "admin" ? "Acceder como Admin" : "Iniciar Sesión"}
            </GradientButton>

            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/50 text-center space-y-4">
              {userType === "empresa" && (
                <>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    ¿Tu empresa aún no tiene cuenta?{" "}
                    <Link href="/registro/empresa" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline transition-colors">
                      Regístrate aquí
                    </Link>
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    ¿Eres influencer?{" "}
                    <Link href="/registro/influencer" className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium hover:underline transition-colors">
                      Únete aquí
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
