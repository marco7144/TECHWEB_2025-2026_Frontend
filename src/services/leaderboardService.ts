import { apiGet } from './api';
import type { PlayerRanking, ArtistRanking } from '../types';

/**
 * Recupera la classifica dei migliori giocatori (per parole indovinate).
 */
export async function getPlayers(): Promise<PlayerRanking[]> {
  return apiGet<PlayerRanking[]>('/api/v1/leaderboards/players');
}

/**
 * Recupera la classifica dei migliori disegnatori (per percentuale di indovino).
 */
export async function getArtists(): Promise<ArtistRanking[]> {
  return apiGet<ArtistRanking[]>('/api/v1/leaderboards/artists');
}
