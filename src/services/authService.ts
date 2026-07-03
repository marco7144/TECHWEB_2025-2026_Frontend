import { apiPost } from './api';
import type { LoginResponse } from '../types';


//Effettua il login e restituisce il token JWT
export async function login(username: string, password: string): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth', { username, password });
}

//Effettua la registrazione di un nuovo utente
export async function signup(username: string, password: string): Promise<void> {
  await apiPost('/signup', { username, password });
}

//Effettua la registrazione seguita da login automatico.
//Restituisce il token JWT.
export async function signupAndLogin(username: string, password: string): Promise<LoginResponse> {
  await signup(username, password);
  return login(username, password);
}
