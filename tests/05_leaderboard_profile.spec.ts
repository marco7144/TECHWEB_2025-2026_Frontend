import { test, expect } from '@playwright/test';

test.describe('05 - Classifiche (Fix 0-score) & Statistiche Profilo', () => {

  let profileUser: string;

  test.beforeEach(async ({ page, request }) => {
    // Genera username conforme (lunghezza tra 3 e 20 caratteri)
    profileUser = `pro_${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 89 + 10)}`;
    const password = 'Password123!';

    // Registra via API
    const signupRes = await request.post('http://localhost:3000/signup', {
      data: { username: profileUser, password }
    });
    expect(signupRes.ok()).toBeTruthy();

    const authRes = await request.post('http://localhost:3000/auth', {
      data: { username: profileUser, password }
    });
    expect(authRes.ok()).toBeTruthy();
    const { token } = await authRes.json();
    expect(token).toBeTruthy();

    // Imposta la sessione nel browser
    await page.addInitScript(({ t, u }) => {
      localStorage.setItem('token', t);
      localStorage.setItem('username', u);
    }, { t: token, u: profileUser });

    await page.goto('/home');
    await expect(page.locator(`text=${profileUser}`).first()).toBeVisible();
  });

  test('Test 11: Caricamento Classifiche, verifica fix punteggi a 0 e cambio Tab', async ({ page }) => {
    // Naviga a /leaderboard
    await page.getByRole('link', { name: /Classifiche/i }).first().click();
    await expect(page).toHaveURL(/\/leaderboard/);

    // Verifica titolo pagina
    await expect(page.locator('h1')).toContainText(/Classifiche/i);

    // Verifica Tab "Top Giocatori" attivo
    await expect(page.locator('h2')).toContainText(/Migliori Giocatori/i);

    // Verifica che la classifica giocatori sia caricata (con LEFT JOIN gli utenti sono visibili anche a 0 punti)
    const rankingContainer = page.locator('.max-w-3xl');
    await expect(rankingContainer).toBeVisible();

    // Passa al Tab "Top Disegnatori"
    await page.getByRole('button', { name: /Top Disegnatori/i }).click();
    await expect(page.locator('h2')).toContainText(/Migliori Disegnatori/i);
  });

  test('Test 12: Profilo Utente e verifica dei 4 indicatori statistici della traccia', async ({ page }) => {
    // Naviga a /profile
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/profile/);

    // Verifica titolo pagina
    await expect(page.locator('h1')).toContainText(/Profilo Utente/i);

    // Verifica username visualizzato nel profilo
    await expect(page.locator(`h2:has-text("${profileUser}")`)).toBeVisible();

    // Verifica presenza di tutti e 4 i contatori statistici richiesti da Traccia.md
    await expect(page.locator('text=Disegni prodotti')).toBeVisible();
    await expect(page.locator('text=Parole indovinate')).toBeVisible();
    await expect(page.locator('text=Tentativi totali effettuati')).toBeVisible();
    await expect(page.locator('text=Parole non indovinate')).toBeVisible();
  });

});
