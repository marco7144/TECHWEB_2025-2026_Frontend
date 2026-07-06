// ============================================
// Interfacce condivise per l'applicazione
// ============================================

// --- Auth ---

export interface LoginResponse {
  token: string;
}

export interface SignupResponse {
  message?: string;
}

// --- Sketches ---

export interface BackendAttempt {
  guess: string;
  is_correct: boolean;
  timestamp?: string;
}

export interface BackendSketch {
  id_sketch: number;
  id_user: number;
  path: string;
  timestamp: string;
  createdAt: string;
  User: {
    username: string;
  };
  user_attempts?: BackendAttempt[];
}

export interface SketchDetail {
  id_sketch: number;
  path: string;
  createdAt: string;
  User: {
    username: string;
  };
  Word?: {
    text: string;
  };
  user_attempts?: BackendAttempt[];
}

export interface AttemptResponse {
  is_correct: boolean;
  attempts_remaining: number;
  solution?: string;
}

// --- Drawing ---

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

export interface WordChoice {
  id_word: number;
  text: string;
}

export interface WordsResponse {
  words: WordChoice[];
  token: string;
}

// --- Leaderboard ---

export interface PlayerRanking {
  id_user: number;
  username: string;
  score: number;
}

export interface ArtistRanking {
  id_user: number;
  username: string;
  percentage: number;
  total_attempts: number;
  successful_attempts: number;
  sketches_count: number;
}
