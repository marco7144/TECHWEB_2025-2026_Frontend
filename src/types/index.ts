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
