// lib/context/BillingContext.tsx
import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface BillingRequest {
  id: string;
  companyId: string;
  platform: string;
  requestedAmount: number;
  calculatedBase?: number;
  calculatedCommission?: number;
  calculatedTotal?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface BillingContextType {
  requests: BillingRequest[];
  currentRequest: BillingRequest | null;
  loading: boolean;
  error: string | null;
  createRequest: (data: any) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const { emit, on, off } = useWebSocket();
  const [requests, setRequests] = useState<BillingRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<BillingRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    on('billing:created', (data) => {
      setRequests((prev) => [data, ...prev]);
      setCurrentRequest(data);
      setLoading(true);
    });

    on('billing:calculating', (data) => {
      console.log('Calculando...', data);
    });

    on('billing:calculated', (data) => {
      setCurrentRequest(data);
      setRequests((prev) =>
        prev.map((req) => (req.id === data.id ? data : req))
      );
      setLoading(false);
    });

    on('billing:approved', (data) => {
      setRequests((prev) =>
        prev.map((req) => (req.id === data.id ? data : req))
      );
    });

    on('billing:rejected', (data) => {
      setRequests((prev) =>
        prev.map((req) => (req.id === data.id ? data : req))
      );
    });

    on('billing:calculation-error', (data) => {
      setError(data.error);
      setLoading(false);
    });

    return () => {
      off('billing:created');
      off('billing:calculating');
      off('billing:calculated');
      off('billing:approved');
      off('billing:rejected');
      off('billing:calculation-error');
    };
  }, [on, off]);

  const createRequest = useCallback(
    (data: any) => {
      setLoading(true);
      setError(null);
      emit('billing:create', data, (response: any) => {
        if (!response.success) {
          setError(response.error);
          setLoading(false);
        }
      });
    },
    [emit],
  );

  const approveRequest = useCallback(
    (requestId: string) => {
      emit('billing:approve', { requestId }, (response: any) => {
        if (!response.success) {
          setError(response.error);
        }
      });
    },
    [emit],
  );

  const rejectRequest = useCallback(
    (requestId: string) => {
      emit('billing:reject', { requestId }, (response: any) => {
        if (!response.success) {
          setError(response.error);
        }
      });
    },
    [emit],
  );

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