import { test, expect } from '@playwright/test';

test.describe('02 - Flussi di Autenticazione & Sicurezza', () => {

  const timestamp = Date.now();
  const testUser = `usr_${timestamp}`;
  const testPassword = 'Password123!';

  test('Test 4: Gestione errori di validazione form (password troppo corta)', async ({ page }) => {
    await page.goto('/');

    // Apri modale di autenticazione
    await page.getByRole('button', { name: /Accedi \/ Registrati/i }).first().click();

    // Passa alla modalità Registrazione
    await page.getByRole('button', { name: /Registrati qui/i }).click();
    await expect(page.getByRole('heading', { name: /Registrati/i })).toBeVisible();

    // Inserisci password non conforme (< 8 caratteri)
    await page.locator('input[placeholder="Username"]').fill(testUser);
    await page.locator('input[placeholder="Password"]').fill('123');
    await page.locator('button[type="submit"]').click();

    // Verifica comparsa messaggio d'errore del frontend
    const errorBox = page.locator('.bg-red-50');
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText(/La password deve contenere almeno 8 caratteri/i);
  });

  test('Test 5: Registrazione (Signup) riuscita con credenziali dinamiche', async ({ page }) => {
    await page.goto('/');

    // Apri modale
    await page.getByRole('button', { name: /Accedi \/ Registrati/i }).first().click();

    // Passa a Registrati
    await page.getByRole('button', { name: /Registrati qui/i }).click();

    // Compila con credenziali valide
    await page.locator('input[placeholder="Username"]').fill(testUser);
    await page.locator('input[placeholder="Password"]').fill(testPassword);
    await page.locator('button[type="submit"]').click();

    // Reindirizzamento automatico alla Galleria
    await expect(page).toHaveURL(/\/home/);

    // Verifica che l'utente loggato sia visualizzato
    await expect(page.locator(`text=${testUser}`)).toBeVisible();

    // Verifica che il token JWT sia salvato nel localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('Test 6: Errore 409 su registrazione con username già esistente', async ({ page }) => {
    await page.goto('/');

    // Apri modale
    await page.getByRole('button', { name: /Accedi \/ Registrati/i }).first().click();
    await page.getByRole('button', { name: /Registrati qui/i }).click();

    // Tenta di riusare lo stesso username
    await page.locator('input[placeholder="Username"]').fill(testUser);
    await page.locator('input[placeholder="Password"]').fill(testPassword);
    await page.locator('button[type="submit"]').click();

    // Verifica errore 409
    const errorBox = page.locator('.bg-red-50');
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText(/Username already exists/i);
  });

  test('Test 7: Login con credenziali valide e Logout con modale di conferma', async ({ page }) => {
    // Naviga come ospite
    await page.goto('/home');

    // Apri modale di login dalla sidebar
    await page.getByRole('button', { name: /Accedi \/ Registrati/i }).first().click();

    // Compila login
    await page.locator('input[placeholder="Username"]').fill(testUser);
    await page.locator('input[placeholder="Password"]').fill(testPassword);
    await page.locator('button[type="submit"]').click();

    // Verifica accesso
    await expect(page.locator(`text=${testUser}`)).toBeVisible();

    // Clicca sul tasto Logout
    const logoutBtn = page.getByRole('button', { name: /Logout/i }).first();
    await logoutBtn.click();

    // Verifica comparsa modale di conferma
    await expect(page.getByRole('heading', { name: /Vuoi disconnetterti?/i })).toBeVisible();

    // Conferma disconnessione
    await page.getByRole('button', { name: /Sì, Scollegati/i }).click();

    // Reindirizzamento alla Landing e cancellazione token
    await expect(page).toHaveURL('/');
    const tokenAfter = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenAfter).toBeNull();
  });

});
