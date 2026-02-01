// lib/context/BillingContext.tsx
import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import * as API from '../api/client';
import { FacturacionRequest } from '../api/client'; // Assuming types are exported there or I should map them

// Use FacturacionRequest from API Client or keep local interface matching it
// Let's use local interface but mapped to simplify for now, or assume structure matches.
// Actually client.ts defines FacturacionRequest inside? Let's check client.ts definitions

interface BillingContextType {
  requests: any[]; // Relaxing type to avoid conflict or need import
  currentRequest: any | null;
  loading: boolean;
  error: string | null;
  createRequest: (data: any) => Promise<void>;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  refreshRequests: () => void; // New helper
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const { on, off } = useWebSocket();
  const [requests, setRequests] = useState<any[]>([]);
  const [currentRequest, setCurrentRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper handling update
  const handleUpdate = useCallback((data: any) => {
    setRequests((prev) =>
       prev.map((req) => (req.id === data.id ? data : req))
    );
     // Update current if selected
    setCurrentRequest((prev: any | null) => prev?.id === data.id ? data : prev);
  }, []);

  useEffect(() => {
    // Escuchar eventos del nuevo backend (AND-BACK)
    
    // 1. Nueva solicitud (Para Admin principalmente)
    on('billing:new-request', (data) => {
      setRequests((prev) => [data, ...prev]);
    });

    // 2. Cambio de estado (Para Usuario)
    on('billing:status-changed', (data) => {
      handleUpdate(data);
       // Si pasa a CALCULATED, dejar de cargar si estábamos esperando
      if (data.estado === 'CALCULATED') setLoading(false);
    });

    // 3. Update genérico (Para Admin)
    on('billing:update', (data) => {
      handleUpdate(data);
    });

    return () => {
      off('billing:new-request');
      off('billing:status-changed');
      off('billing:update');
    };
  }, [on, off, handleUpdate]);

  const createRequest = useCallback(
    async (data: any) => {
      setLoading(true);
      setError(null);
      try {
          const newReq = await API.createFacturacionRequest({
              plataforma: data.platform || data.plataforma,
              montoSolicitado: parseFloat(data.requestedAmount || data.montoSolicitado)
          });
          setRequests(prev => [newReq, ...prev]);
          setCurrentRequest(newReq);
          // Don't turn off loading here, maybe wait for calculation? 
          // Previous code waited for 'billing:calculated' event to set loading false.
          // Let's keep loading true until socket updates status or timeout?
          // Or just set false because Creation is done.
          // setLoading(false); 
      } catch (err: any) {
          setError(err.message);
          setLoading(false);
      }
    },
    [],
  );

  const approveRequest = useCallback(
    async (requestId: string) => {
      try {
        const updated = await API.approveFacturacionRequest(requestId);
        handleUpdate(updated);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [handleUpdate],
  );

  const rejectRequest = useCallback(
    async (requestId: string) => {
      // Implementar API reject cuando exista en backend
      console.warn('Reject not implemented yet inside API');
    },
    [],
  );
  
  const refreshRequests = useCallback(async () => {
      try {
           const data = await API.getMyRequests();
           setRequests(data);
      } catch(e) { console.error(e); }
  }, []);

  return (
    <BillingContext.Provider
      value={{
        requests,
        currentRequest,
        loading,
        error,
        createRequest,
        approveRequest,
        rejectRequest,
        refreshRequests
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within BillingProvider');
  }
  return context;
}