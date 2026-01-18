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
import { login as apiLogin } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"empresa" | "admin">("empresa");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Ingresa email y contraseña");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiLogin({ email, password });
      await login(response.access_token);
      
      // Redirigir después de cargar usuario
      // El hook de UserContext ya tiene el usuario actualizado
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[#000B05] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] w-[50%] h-[50%] bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <BackButton />

        <div className="bg-[var(--surface)] dark:bg-[#011F10]/50 backdrop-blur-xl border border-slate-200 dark:border-[#04301C] rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E6F4EA] to-[#F2FBF5] dark:from-[#045932] dark:to-[#03A64A] flex items-center justify-center border border-slate-200 dark:border-white/10 text-[var(--primary)] dark:text-white mb-4 shadow-inner">
              <SignIn size={32} weight="duotone" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] dark:text-white">Bienvenido de nuevo</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Accede a tu panel de control</p>
          </div>

          <div className="space-y-6">
            {/* Selector de tipo de usuario */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] dark:text-slate-300 mb-3">
                Tipo de acceso
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("empresa")}
                  className={`px-4 py-3 rounded-xl border-2 transition-all ${
                    userType === "empresa"
                      ? "border-[var(--accent)] bg-[var(--primary)]/5 dark:bg-[var(--primary)]/20 text-[var(--primary)] dark:text-white"
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
              theme="brand"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="space-y-1">
              <InputGroup 
                label="Contraseña"
                icon={<LockKey size={18} />}
                placeholder="••••••••"
                type="password"
                theme="brand"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {userType === "empresa" && (
                <div className="text-right">
                  <Link href="#" className="text-xs text-slate-500 hover:text-[var(--accent)] transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-xs text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            <GradientButton 
              onClick={handleLogin}
              theme="brand"
              className="mt-8"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </GradientButton>

            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/50 text-center space-y-4">
              {userType === "empresa" && (
                <>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    ¿Tu empresa aún no tiene cuenta?{" "}
                    <Link href="/registro/empresa" className="text-[var(--primary)] dark:text-[var(--accent)] hover:underline font-medium transition-colors">
                      Regístrate aquí
                    </Link>
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    ¿Eres influencer?{" "}
                    <Link href="/registro/influencer" className="text-[var(--primary)] dark:text-[var(--accent)] hover:underline font-medium transition-colors">
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
