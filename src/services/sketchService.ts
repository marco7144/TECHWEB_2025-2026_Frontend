import { apiGet } from './api';
import type { BackendSketch, SketchDetail } from '../types';

/**
 * Recupera la lista di tutti gli sketch dalla galleria.
 */
export async function getSketches(): Promise<BackendSketch[]> {
  return apiGet<BackendSketch[]>('/api/v1/sketches');
}

/**
 * Recupera i dettagli di uno sketch specifico (inclusi tentativi utente e parola se risolta).
 */
export async function getSketch(id: number | string): Promise<SketchDetail> {
  return apiGet<SketchDetail>(`/api/v1/sketches/${id}`);
}
