// ============================================
// Interfacce condivise per l'applicazione
// I tipi delle API sono derivati automaticamente
// dalla specifica OpenAPI generata dal backend.
// ============================================

import type { components, paths } from './api-schema';

export type { paths };
export type ApiSchemas = components['schemas'];

// --- Auth ---
export type UserCredentials = components['schemas']['UserCredentials'];
export type LoginResponse = components['schemas']['LoginResponse'];
export type SignupResponse = components['schemas']['SignupResponse'];
export type ErrorResponse = components['schemas']['ErrorResponse'];

// --- Sketches ---
export type CreateSketchRequest = components['schemas']['CreateSketchRequest'];
export type CreateAttemptRequest = components['schemas']['CreateAttemptRequest'];
export type BackendAttempt = components['schemas']['BackendAttempt'];
export type BackendSketch = components['schemas']['BackendSketch'];
export type SketchDetail = components['schemas']['SketchDetail'];
export type AttemptResponse = components['schemas']['AttemptResponse'];

// --- Drawing / Words ---
export type WordChoice = components['schemas']['WordChoice'];
export type WordsResponse = components['schemas']['WordsResponse'];

// --- User Stats & Leaderboards ---
export type Stats = components['schemas']['UserStats'];
export type PlayerRanking = components['schemas']['PlayerRanking'];
export type ArtistRanking = components['schemas']['ArtistRanking'];

// --- Local Drawing / Canvas Types ---
export interface PathObject {
  type: 'path';
  path: string;
  stroke: string;
  strokeWidth: number;
  fill: string | null;
}

export interface PathObjectWithPoints extends PathObject {
  points: { x: number; y: number }[];
}

export interface CanvasData {
  objects: PathObject[];
  width?: number;
  height?: number;
}
