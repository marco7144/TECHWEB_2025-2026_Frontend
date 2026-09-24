import { test, expect } from '@playwright/test';

test.describe('04 - Gameplay (Tentativi di Indovinello & Anti-Spoiler)', () => {

  test.beforeEach(async ({ page, request }) => {
    // Genera username conforme (lunghezza tra 3 e 20 caratteri)
    const guesserUser = `gue_${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 89 + 10)}`;
    const password = 'Password123!';

    // Registra via API
    const signupRes = await request.post('http://localhost:3000/signup', {
      data: { username: guesserUser, password }
    });
    expect(signupRes.ok()).toBeTruthy();

    const authRes = await request.post('http://localhost:3000/auth', {
      data: { username: guesserUser, password }
    });
    expect(authRes.ok()).toBeTruthy();
    const { token } = await authRes.json();
    expect(token).toBeTruthy();

    // Imposta la sessione nel browser
    await page.addInitScript(({ t, u }) => {
      localStorage.setItem('token', t);
      localStorage.setItem('username', u);
    }, { t: token, u: guesserUser });

    await page.goto('/home');
    await expect(page.locator(`text=${guesserUser}`).first()).toBeVisible();
  });

  test('Test 10: Apertura modale indovinello, tentativo errato e decremento tentativi', async ({ page }) => {
    // Attendi che i capolavori siano caricati nella griglia
    const sketchCard = page.locator('.sketch-card').first();
    await expect(sketchCard).toBeVisible();

    // Cerca il bottone "Indovina Parola!"
    const guessButton = page.locator('button:has-text("Indovina Parola!")').first();
    await expect(guessButton).toBeVisible();
    await guessButton.click();

    // Verifica comparsa del modale Guess
    await expect(page.locator('text=Indovina la Parola').first()).toBeVisible();

    // Verifica indicatore dei tentativi
    await expect(page.locator('text=Tentativi Rimasti:')).toBeVisible();

    // Invia un tentativo errato (usando il placeholder reale "Scrivi la tua risposta...")
    const guessInput = page.locator('input[placeholder="Scrivi la tua risposta..."]');
    await expect(guessInput).toBeVisible();

    const randomWrongWord = `sbagliata_${Math.floor(Math.random() * 1000)}`;
    await guessInput.fill(randomWrongWord);
    await page.getByRole('button', { name: /Invia/i }).click();

    // Verifica che la parola compaia nella lista tentativi
    await expect(page.locator(`text=${randomWrongWord}`)).toBeVisible();

    // Verifica blocco tentativi duplicati
    await guessInput.fill(randomWrongWord);
    await page.getByRole('button', { name: /Invia/i }).click();
    await expect(page.getByText(/You have already tried this word/i)).toBeVisible();

    // Chiudi il modale
    await page.locator('button:has-text("✕")').click();
  });

});
