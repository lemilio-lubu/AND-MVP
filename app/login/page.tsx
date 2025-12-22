"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Envelope, LockKey, SignIn } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { InputGroup } from "@/app/components/ui/InputGroup";
import { GradientButton } from "@/app/components/ui/GradientButton";
import { BackButton } from "@/app/components/ui/BackButton";

export default function LoginPage() {
  const router = useRouter();

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

          <div className="space-y-5">
            <InputGroup 
              label="Correo Electrónico"
              icon={<Envelope size={18} />}
              placeholder="tu@email.com"
              theme="blue"
            />

            <div className="space-y-1">
              <InputGroup 
                label="Contraseña"
                icon={<LockKey size={18} />}
                placeholder="••••••••"
                type="password"
                theme="blue"
              />
              <div className="text-right">
                <Link href="#" className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <GradientButton 
              onClick={() => router.push("/dashboard")}
              theme="blue"
              className="mt-8"
            >
              Iniciar Sesión
            </GradientButton>

            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/50 text-center space-y-4">
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
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
