import { apiGet, apiPost } from './api';
import type { BackendSketch, SketchDetail, AttemptResponse, WordsResponse, CreateSketchRequest } from '../types';

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

/**
 * Crea un nuovo sketch (invia il disegno al backend).
 */
export async function createSketch(data: CreateSketchRequest): Promise<BackendSketch> {
  return apiPost<BackendSketch>('/api/v1/sketches', data);
}

/**
 * Invia un tentativo di indovinare la parola di uno sketch.
 */
export async function submitAttempt(sketchId: number | string, guess: string): Promise<AttemptResponse> {
  return apiPost<AttemptResponse>(`/api/v1/sketches/${sketchId}/attempts`, { guess });
}

/**
 * Recupera 3 parole casuali per il disegno (richiede autenticazione).
 */
export async function getRandomWords(): Promise<WordsResponse> {
  return apiGet<WordsResponse>('/api/v1/words/random');
}
