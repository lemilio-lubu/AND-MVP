"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMe, saveToken, removeToken, hasToken, MeResponse } from "@/lib/api/client";

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
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function mapMeResponseToUser(me: MeResponse): User {
  return {
    id: me.id,
    type: me.role.toLowerCase() as "admin" | "empresa" | "influencer",
    isNew: me.is_new,
    email: me.empresa?.correo_corporativo || "",
    name: me.empresa?.razon_social || "Usuario",
    hasEmittedFirstInvoice: me.has_emitted_first_invoice,
    empresa: me.empresa,
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
        } catch (error) {
          console.error("Error loading user:", error);
          removeToken();
        }
      }
      setLoading(false);
    };

    initUser();
  }, []);

  const login = async (token: string) => {
    saveToken(token);
    const me = await getMe();
    setUser(mapMeResponseToUser(me));
  };

  const logout = () => {
    setUser(null);
    removeToken();
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
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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
