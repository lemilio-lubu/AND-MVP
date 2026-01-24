// lib/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'empresa' | 'influencer' | 'admin';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me', { withCredentials: true });
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await axios.post(
      '/api/auth/login',
      { email, password },
      { withCredentials: true },
    );
    localStorage.setItem('accessToken', res.data.tokens.accessToken);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    type: string,
  ) => {
    const res = await axios.post(
      '/api/auth/register',
      { email, password, name, type },
      { withCredentials: true },
    );
    localStorage.setItem('accessToken', res.data.tokens.accessToken);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return { user, isLoading, login, register, logout };
}