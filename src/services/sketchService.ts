import { apiGet } from './api';
import type { BackendSketch } from '../types';

/**
 * Recupera la lista di tutti gli sketch dalla galleria.
 */
export async function getSketches(): Promise<BackendSketch[]> {
  return apiGet<BackendSketch[]>('/api/v1/sketches');
}
