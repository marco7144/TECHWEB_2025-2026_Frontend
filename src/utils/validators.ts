/**
 * Valida lo username fornito.
 * @returns Un messaggio di errore in formato stringa se non è valido, altrimenti null.
 */
export function validateUsername(username: string, requireRegex = false): string | null {
  if (!username.trim()) {
    return "Username è richiesto";
  }
  
  if (requireRegex) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return "Lo username deve avere da 3 a 20 caratteri e contenere solo lettere, numeri e underscore";
    }
  }

  return null;
}

/**
 * Valida la password fornita.
 * @returns Un messaggio di errore in formato stringa se non è valida, altrimenti null.
 */
export function validatePassword(password: string, checkMinLength = false): string | null {
  if (!password) {
    return "La password è richiesta";
  }

  if (checkMinLength && password.length < 8) {
    return "La password deve contenere almeno 8 caratteri";
  }

  return null;
}
