"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Buildings, Envelope, IdentificationCard, LockKey, Phone, MapPin } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { InputGroup } from "@/app/components/ui/InputGroup";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { GradientButton } from "@/app/components/ui/GradientButton";
import { BackButton } from "@/app/components/ui/BackButton";
import { useUser } from "@/lib/context/UserContext";
import { register as apiRegister, createEmpresa } from "@/lib/api/client";

export default function EmpresaRegistro() {
  const [accepted, setAccepted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ruc, setRuc] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useUser();

  const handleRegister = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!companyName || !email || !ruc || !telefono || !ciudad || !password) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      // 1. Registrar usuario
      const authResponse = await apiRegister({
        email,
        password,
        role: "EMPRESA",
      });

      // 2. Login automático
      await login(authResponse.access_token);

      // 3. Crear empresa
      await createEmpresa({
        razon_social: companyName,
        correo_corporativo: email,
        ruc,
        telefono,
        ciudad,
      });

      // 4. Redirigir a dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error al registrar empresa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[#000B05] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <BackButton />

        <div className="bg-[var(--surface)] dark:bg-[#011F10]/50 backdrop-blur-xl border border-slate-200 dark:border-[#04301C] rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E6F4EA] to-[#F2FBF5] dark:from-[#045932] dark:to-[#03A64A] flex items-center justify-center border border-slate-200 dark:border-[#045932]/30 text-[var(--primary)] dark:text-white">
              <Buildings size={24} weight="duotone" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-main)] dark:text-white">Registro Corporativo</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Optimiza tu gestión financiera</p>
            </div>
          </div>

          <div className="space-y-4">
            <InputGroup 
              label="Nombre de la Empresa"
              icon={<Buildings size={18} />}
              placeholder="Ej. Tech Solutions S.A.C."
              theme="brand"
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <InputGroup 
              label="Correo Corporativo"
              icon={<Envelope size={18} />}
              placeholder="contacto@empresa.com"
              theme="brand"
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputGroup 
              label="RUC / Identificación Fiscal"
              icon={<IdentificationCard size={18} />}
              placeholder="20123456789"
              theme="brand"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
            />

            <InputGroup 
              label="Teléfono"
              icon={<Phone size={18} />}
              placeholder="+593 99 999 9999"
              theme="blue"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />

            <InputGroup 
              label="Ciudad"
              icon={<MapPin size={18} />}
              placeholder="Quito"
              theme="blue"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
            />

            <InputGroup 
              label="Contraseña"
              icon={<LockKey size={18} />}
              placeholder="••••••••"
              type="password"
              theme="brand"
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputGroup 
              label="Confirmar Contraseña"
              icon={<LockKey size={18} />}
              placeholder="••••••••"
              type="password"
              theme="brand"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Checkbox 
              checked={accepted} 
              onChange={setAccepted}
              theme="brand"
            >
              Acepto los <span className="text-[var(--primary)] dark:text-[var(--accent)] hover:underline">Términos y Condiciones</span> y la <span className="text-[var(--primary)] dark:text-[var(--accent)] hover:underline">Política de Privacidad</span>.
            </Checkbox>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-xs text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            <GradientButton 
              disabled={!accepted || loading}
              onClick={handleRegister}
              theme="brand"
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta Empresarial"}
            </GradientButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
