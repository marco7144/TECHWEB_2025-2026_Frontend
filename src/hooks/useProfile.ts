import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import type { Stats } from '../types';

// ============================================
// Hook per le statistiche del profilo.
// Gestisce il fetch dei dati solo se l'utente
// non è un Guest.
// ============================================

interface UseProfileReturn {
  isGuest: boolean;
  username: string;
  stats: Stats | null;
  isLoading: boolean;
  error: string | null;
}

export function useProfile(): UseProfileReturn {
  const { isGuest, username } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isGuest) {
      setIsLoading(false);
      return;
    }

    userService.getMyStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error("Errore nel caricamento delle statistiche:", err);
        setError("Impossibile caricare le statistiche dal server.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isGuest]);

  return {
    isGuest,
    username,
    stats,
    isLoading,
    error,
  };
}
