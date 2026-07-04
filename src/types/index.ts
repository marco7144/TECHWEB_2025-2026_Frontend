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
