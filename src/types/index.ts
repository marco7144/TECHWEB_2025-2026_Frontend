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
