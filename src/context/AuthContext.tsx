import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as authService from '../services/authService';

// ============================================
// Interfaccia del contesto di autenticazione
// ============================================
interface AuthContextValue {
  /** true se l'utente non è autenticato (nessun token) */
  isGuest: boolean;
  /** Username dell'utente corrente (stringa vuota se guest) */
  username: string;
  /** Token JWT corrente (null se guest) */
  token: string | null;
  /** Effettua il login, salva token e username */
  login: (username: string, password: string) => Promise<void>;
  /** Effettua la registrazione + login automatico */
  signup: (username: string, password: string) => Promise<void>;
  /** Effettua il logout, rimuove token e username */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================
// Provider
// ============================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');

  const isGuest = !token;

  // Sincronizza lo stato se il localStorage cambia da un'altra tab
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
      setUsername(localStorage.getItem('username') || '');
    };

    const handleUnauthorized = () => {
      setToken(null);
      setUsername('');
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth-unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (user: string, password: string) => {
    const data = await authService.login(user, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', user);
    setToken(data.token);
    setUsername(user);
  }, []);

  const signup = useCallback(async (user: string, password: string) => {
    const data = await authService.signupAndLogin(user, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', user);
    setToken(data.token);
    setUsername(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername('');
  }, []);

  return (
    <AuthContext.Provider value={{ isGuest, username, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// Hook
// ============================================
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato dentro un <AuthProvider>');
  }
  return context;
}
