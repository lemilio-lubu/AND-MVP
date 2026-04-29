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
  const [customName, setCustomName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCustomName(localStorage.getItem("and_custom_name") || "");
      setLogoUrl(localStorage.getItem("and_custom_logo") || "");
    }
  }, []);

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

  const handleSaveCustomProfile = () => {
    localStorage.setItem("and_custom_name", customName);
    localStorage.setItem("and_custom_logo", logoUrl);
    alert("Perfil actualizado correctamente. Los cambios se reflejarán en la barra lateral.");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
          href={user.type === 'admin' ? "/admin" : "/inicio/wallet"} 
          label="Volver al Panel" 
        />

        <div className="bg-[var(--surface)] dark:bg-[#011F10]/50 backdrop-blur-xl border border-slate-200 dark:border-[#04301C] rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 dark:border-[#04301C] bg-slate-50/50 dark:bg-[#04301C]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#E6F4EA] to-[#F2FBF5] dark:from-[#045932] dark:to-[#03A64A] flex items-center justify-center border border-slate-200 dark:border-white/10 text-[var(--primary)] dark:text-white shadow-inner flex-shrink-0">
                <User size={24} weight="duotone" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] dark:text-white">Mi Perfil</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Gestiona tu información personal</p>
              </div>
            </div>
            
            <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 uppercase self-start sm:self-auto">
              {user.type}
            </div>
          </div>

          <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
            
            {/* Info Section */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2 sm:mb-4 flex items-center gap-2">
                <IdentificationCard size={18} />
                Información de Cuenta
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="h-px bg-slate-200 dark:bg-slate-800" />

            {/* Customization Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={18} />
                Personalización
              </h3>

              <div className="space-y-4 max-w-md">
                <InputGroup
                  label="Nombre a mostrar"
                  icon={<Buildings size={18} />}
                  type="text"
                  placeholder="Ej. Mi Agencia"
                  theme="brand"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Logo de la empresa
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Buildings size={24} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg"
                        onChange={handleLogoUpload}
                        className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary)]/90 cursor-pointer"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Sube un archivo PNG o JPG (máx. 2MB)</p>
                </div>

                <div className="pt-2">
                  <GradientButton 
                    onClick={handleSaveCustomProfile}
                    theme="brand"
                  >
                    Guardar Personalización
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
