"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LockKey, Envelope, ShieldCheck, IdentificationCard, Buildings, Phone, MapPin } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useUser } from "@/lib/context/UserContext";
import { BackButton } from "@/app/components/ui/BackButton";
import { InputGroup } from "@/app/components/ui/InputGroup";
import { GradientButton } from "@/app/components/ui/GradientButton";
import { changePassword } from "@/lib/api/client";

export default function PerfilPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!newPassword || !confirmNewPassword) {
      setPasswordError("Ingresa la nueva contraseña");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    setUpdating(true);
    try {
      await changePassword({ 
        currentPassword: currentPassword || undefined, // Send if present
        newPassword 
      });
      setPasswordSuccess("Contraseña actualizada correctamente");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "Error al actualizar contraseña");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[#000B05] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
       {/* Background Gradients */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-[var(--primary)]/5 dark:bg-[var(--primary)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] w-[50%] h-[50%] bg-[var(--accent)]/5 dark:bg-[var(--accent)]/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <BackButton 
          href={user.type === 'admin' ? "/admin" : "/dashboard"} 
          label="Volver al Panel" 
        />

        <div className="bg-[var(--surface)] dark:bg-[#011F10]/50 backdrop-blur-xl border border-slate-200 dark:border-[#04301C] rounded-2xl padding-8 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-200 dark:border-[#04301C] bg-slate-50/50 dark:bg-[#04301C]/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E6F4EA] to-[#F2FBF5] dark:from-[#045932] dark:to-[#03A64A] flex items-center justify-center border border-slate-200 dark:border-white/10 text-[var(--primary)] dark:text-white shadow-inner">
                <User size={24} weight="duotone" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-main)] dark:text-white">Mi Perfil</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Gestiona tu información personal</p>
              </div>
            </div>
            
            <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 uppercase">
              {user.type}
            </div>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Info Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                <IdentificationCard size={18} />
                Información de Cuenta
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                   {/* Using readOnly input for display */}
                   <InputGroup
                    label="Correo Electrónico"
                    icon={<Envelope size={18} />}
                    value={user.email || ""}
                    theme="brand"
                    readOnly
                    className="opacity-75 cursor-not-allowed"
                   />
                </div>
                <div className="space-y-1">
                   <InputGroup
                    label="Rol de Usuario"
                    icon={<ShieldCheck size={18} />}
                    value={user.type?.toUpperCase() || ""}
                    theme="brand"
                    readOnly
                    className="opacity-75 cursor-not-allowed"
                   />
                </div>

                {user.empresa && (
                  <>
                    <div className="space-y-1 md:col-span-2">
                       <InputGroup
                        label="Razón Social"
                        icon={<Buildings size={18} />}
                        value={user.empresa.razon_social}
                        theme="brand"
                        readOnly
                        className="opacity-75 cursor-not-allowed"
                       />
                    </div>
                    <div className="space-y-1">
                       <InputGroup
                        label="RUC"
                        icon={<IdentificationCard size={18} />}
                        value={user.empresa.ruc}
                        theme="brand"
                        readOnly
                        className="opacity-75 cursor-not-allowed"
                       />
                    </div>
                    <div className="space-y-1">
                       <InputGroup
                        label="Teléfono"
                        icon={<Phone size={18} />}
                        value={user.empresa.telefono}
                        theme="brand"
                        readOnly
                        className="opacity-75 cursor-not-allowed"
                       />
                    </div>
                    <div className="space-y-1">
                       <InputGroup
                        label="Ciudad"
                        icon={<MapPin size={18} />}
                        value={user.empresa.ciudad}
                        theme="brand"
                        readOnly
                        className="opacity-75 cursor-not-allowed"
                       />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-800" />

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                <LockKey size={18} />
                Seguridad
              </h3>

              <div className="space-y-3 max-w-md">
                {/* Optional: Current Password field depending on backend requirements. Including for completeness. */}
                <InputGroup
                  label="Contraseña Actual"
                  icon={<LockKey size={18} />}
                  type="password"
                  placeholder="••••••••"
                  theme="brand"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <InputGroup
                  label="Nueva Contraseña"
                  icon={<LockKey size={18} />}
                  type="password"
                  placeholder="••••••••"
                  theme="brand"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <InputGroup
                  label="Confirmar Nueva Contraseña"
                  icon={<LockKey size={18} />}
                  type="password"
                  placeholder="••••••••"
                  theme="brand"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />

                {passwordError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">{passwordSuccess}</p>
                )}

                <div className="pt-2">
                  <GradientButton 
                    onClick={handleChangePassword}
                    disabled={updating}
                    theme="brand"
                  >
                    {updating ? "Actualizando..." : "Actualizar Contraseña"}
                  </GradientButton>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
