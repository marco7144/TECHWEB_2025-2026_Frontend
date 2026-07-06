import { apiGet } from './api';
import type { Stats } from '../types';

/**
 * Recupera le statistiche dell'utente corrente (richiede autenticazione).
 */
export async function getMyStats(): Promise<Stats> {
  return apiGet<Stats>('/api/v1/users/me/stats');
}
