import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateUsername, validatePassword } from '../utils/validators';

// ============================================
// Hook condiviso per i form di autenticazione.
// Usato da Login.tsx, Signup.tsx e AuthModal.tsx.
// ============================================

interface UseAuthFormOptions {
  /** 'login' o 'signup' — determina quale azione eseguire */
  mode: 'login' | 'signup';
  /** Callback opzionale al successo (usato da AuthModal) */
  onSuccess?: () => void;
  /** Se true, naviga a /home dopo il successo (usato dalle pagine standalone) */
  redirectOnSuccess?: boolean;
}

interface UseAuthFormReturn {
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  error: string | null;
  success: string | null;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useAuthForm({ mode, onSuccess, redirectOnSuccess = true }: UseAuthFormOptions): UseAuthFormReturn {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Resetta errori e messaggi quando si cambia modalità (login <-> signup)
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validazione username usando l'utility esterna
    const isSignup = mode === 'signup';
    const usernameError = validateUsername(username, isSignup);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    // Validazione password usando l'utility esterna
    const passwordError = validatePassword(password, isSignup);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(username, password);
        setSuccess("Accesso effettuato! Reindirizzamento...");
      } else {
        await signup(username, password);
        setSuccess("Registrazione completata! Accesso in corso...");
      }

      setTimeout(() => {
        onSuccess?.();
        if (redirectOnSuccess) {
          navigate('/home');
        }
      }, mode === 'login' ? 500 : 1000);
    } catch (err: any) {
      setError(err.message || "Si è verificato un errore imprevisto.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    success,
    isLoading,
    handleSubmit,
  };
}
