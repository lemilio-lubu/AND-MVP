"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMe, saveToken, removeToken, hasToken, MeResponse } from "@/lib/api/client";
import {
  getCurrentMockCompanyUser,
  loginCompanyMock,
  logoutMock,
  registerCompanyMock,
} from "@/lib/auth/mockAuthStorage";
import { RegisterCompanyInput } from "@/lib/auth/types";

// Nuevo tipo User mapeado desde MeResponse
export interface User {
  id: string;
  type: "admin" | "empresa" | "influencer";
  isNew: boolean;
  email: string;
  name: string;
  hasEmittedFirstInvoice: boolean;
  empresa?: {
    id: string;
    razon_social: string;
    correo_corporativo: string;
    ruc: string;
    telefono: string;
    ciudad: string;
    estado_tributario: "PENDIENTE" | "ACTIVO" | "SUSPENDIDO";
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  loginMockCompany: (email: string, password: string) => Promise<void>;
  registerMockCompany: (input: RegisterCompanyInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function mapMeResponseToUser(me: MeResponse): User {
  const normalizedRole = me.role?.toLowerCase();
  const type: User["type"] =
    normalizedRole === "admin"
      ? "admin"
      : normalizedRole === "influencer"
        ? "influencer"
        : "empresa";

  return {
    id: me.id,
    type,
    isNew: me.is_new,
    email: me.email || me.empresa?.correo_corporativo || "",
    name: me.empresa?.razon_social || "Usuario",
    hasEmittedFirstInvoice: me.has_emitted_first_invoice,
    empresa: me.empresa,
  };
}

function mapMockCompanyToUser(mockUser: ReturnType<typeof getCurrentMockCompanyUser>): User | null {
  if (!mockUser) return null;
  return {
    id: mockUser.id,
    type: "empresa",
    isNew: true,
    email: mockUser.email,
    name: mockUser.companyName,
    hasEmittedFirstInvoice: false,
    empresa: {
      id: mockUser.id,
      razon_social: mockUser.companyName,
      correo_corporativo: mockUser.email,
      ruc: mockUser.ruc,
      telefono: mockUser.telefono,
      ciudad: mockUser.ciudad,
      estado_tributario: "PENDIENTE",
    },
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde token al montar
  useEffect(() => {
    const initUser = async () => {
      if (hasToken()) {
        try {
          const me = await getMe();
          setUser(mapMeResponseToUser(me));
        } catch (error: unknown) {
          // Si es error de autenticación (Token expirado/inválido), limpiar silenciosamente
          const message = error instanceof Error ? error.message : "";
          if (message === "Unauthorized" || message.includes("401")) {
            console.log("Sesión expirada o inválida, limpiando token.");
          } else {
            console.error("Error loading user:", error);
          }
          removeToken();
        }
      } else {
        const mockUser = getCurrentMockCompanyUser();
        const mappedMockUser = mapMockCompanyToUser(mockUser);
        if (mappedMockUser) {
          setUser(mappedMockUser);
        }
      }
      setLoading(false);
    };

    initUser();
  }, []);

  const login = async (token: string) => {
    console.log('🔐 Login: Guardando token y obteniendo datos de usuario...');
    saveToken(token);
    try {
      const me = await getMe();
      console.log('✅ Login: Datos recibidos del backend:', me);
      const mappedUser = mapMeResponseToUser(me);
      console.log('✅ Login: Usuario mapeado:', mappedUser);
      setUser(mappedUser);
    } catch (error) {
      console.error('❌ Login: Error obteniendo datos:', error);
      removeToken();
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logout: Limpiando sesión...');
    setUser(null);
    logoutMock();
    removeToken();
    console.log('✅ Logout: Sesión limpiada');
  };

  const loginMockCompany = async (email: string, password: string) => {
    await loginCompanyMock(email, password);
    const mockUser = getCurrentMockCompanyUser();
    const mappedUser = mapMockCompanyToUser(mockUser);
    if (!mappedUser) {
      throw new Error("No se pudo crear la sesión mock");
    }
    setUser(mappedUser);
  };

  const registerMockCompany = async (input: RegisterCompanyInput) => {
    await registerCompanyMock(input);
    const mockUser = getCurrentMockCompanyUser();
    const mappedUser = mapMockCompanyToUser(mockUser);
    if (!mappedUser) {
      throw new Error("No se pudo inicializar la sesión mock después del registro");
    }
    setUser(mappedUser);
  };

  const refreshUser = async () => {
    if (hasToken()) {
      try {
        const me = await getMe();
        setUser(mapMeResponseToUser(me));
      } catch (error) {
        console.error("Error refreshing user:", error);
        logout();
      }
      return;
    }

    const mockUser = getCurrentMockCompanyUser();
    setUser(mapMockCompanyToUser(mockUser));
  };

  return (
    <UserContext.Provider value={{ user, loading, login, loginMockCompany, registerMockCompany, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
