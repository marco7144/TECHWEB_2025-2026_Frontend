import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as leaderboardService from '../services/leaderboardService';
import type { PlayerRanking, ArtistRanking } from '../types';

// ============================================
// Hook per le classifiche.
// Gestisce il fetch dei dati e la sincronizzazione
// del tab attivo.
// ============================================

interface UseLeaderboardReturn {
  activeTab: 'players' | 'artists';
  setActiveTab: (tab: 'players' | 'artists') => void;
  players: PlayerRanking[];
  artists: ArtistRanking[];
  isLoading: boolean;
  error: string | null;
}

export function useLeaderboard(): UseLeaderboardReturn {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'players' | 'artists'>('players');
  const [players, setPlayers] = useState<PlayerRanking[]>([]);
  const [artists, setArtists] = useState<ArtistRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sincronizza il tab attivo dallo stato della rotta (se passato)
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Carica i dati delle classifiche
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      leaderboardService.getPlayers(),
      leaderboardService.getArtists()
    ])
      .then(([playersData, artistsData]) => {
        setPlayers(playersData);
        setArtists(artistsData);
      })
      .catch((err) => {
        console.error("Errore fetch classifiche:", err);
        setError("Impossibile caricare le classifiche dal server.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    activeTab,
    setActiveTab,
    players,
    artists,
    isLoading,
    error,
  };
}
