// lib/hooks/useWebSocket.ts
import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      withCredentials: true,
      auth: {
        token: localStorage.getItem('accessToken'),
      },
    });

    socketRef.current.on('connect', () => {
      console.log('[WebSocket] Connected');
      socketRef.current?.emit('billing:join', { userId: user.id });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  const emit = useCallback((event: string, data: any, callback?: (response: any) => void) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data, callback);
    }
  }, []);

  const on = useCallback((event: string, handler: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  }, []);

  const off = useCallback((event: string) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  }, []);

  return { emit, on, off, socket: socketRef.current };
}