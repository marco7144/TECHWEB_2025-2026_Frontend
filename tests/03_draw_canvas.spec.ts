import { test, expect } from '@playwright/test';

test.describe('03 - Area Disegno (Canvas & Anti-Cheat)', () => {

  test.beforeEach(async ({ page, request }) => {
    // Genera username conforme (lunghezza tra 3 e 20 caratteri)
    const artistUser = `art_${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 89 + 10)}`;
    const password = 'Password123!';

    // Registra e ottieni il token via API
    const signupRes = await request.post('http://localhost:3000/signup', {
      data: { username: artistUser, password }
    });
    expect(signupRes.ok()).toBeTruthy();

    const authRes = await request.post('http://localhost:3000/auth', {
      data: { username: artistUser, password }
    });
    expect(authRes.ok()).toBeTruthy();
    const { token } = await authRes.json();
    expect(token).toBeTruthy();

    // Imposta la sessione nel browser
    await page.addInitScript(({ t, u }) => {
      localStorage.setItem('token', t);
      localStorage.setItem('username', u);
    }, { t: token, u: artistUser });

    await page.goto('/home');
    await expect(page.locator(`text=${artistUser}`).first()).toBeVisible();
  });

  test('Test 8: Selezione parole casuali offerte e caricamento Canvas con Timer', async ({ page }) => {
    await page.goto('/draw');

    // Verifica titolo
    await expect(page.locator('h1')).toContainText(/Area Disegno/i);

    // Verifica comparsa delle 3 opzioni parole
    await expect(page.locator('h2')).toContainText(/Scegli una parola/i);
    const wordButtons = page.locator('.grid button');
    await expect(wordButtons).toHaveCount(3);

    // Seleziona la prima parola
    const selectedWordText = (await wordButtons.first().innerText()).trim();
    await wordButtons.first().click();

    // Verifica transizione allo stato di disegno
    await expect(page.locator('text=Parola da disegnare:')).toBeVisible();
    await expect(page.locator(`text=${selectedWordText}`)).toBeVisible();

    // Verifica presenza del timer (120 secondi iniziali)
    const timer = page.locator('.tabular-nums');
    await expect(timer).toBeVisible();
    await expect(timer).toContainText(/1:5|2:00/);

    // Verifica presenza del canvas
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('Test 9: Interazione sul Canvas (tratti, undo) e Invio riuscito', async ({ page }) => {
    await page.goto('/draw');

    // Scegli una delle 3 parole offerte
    const firstWordBtn = page.locator('.grid button').first();
    await expect(firstWordBtn).toBeVisible();
    await firstWordBtn.click();

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    if (!box) return;

    // Disegna un primo tratto sul canvas
    await page.mouse.move(box.x + 50, box.y + 50);
    await page.mouse.down();
    await page.mouse.move(box.x + 150, box.y + 150, { steps: 5 });
    await page.mouse.up();

    // Verifica che il contatore dei tratti mostri 1
    const strokeCounter = page.locator('text=Tratti disegnati:').locator('..').locator('span').last();
    await expect(strokeCounter).toHaveText('1');

    // Disegna un secondo tratto
    await page.mouse.move(box.x + 200, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 250, box.y + 100, { steps: 5 });
    await page.mouse.up();
    await expect(strokeCounter).toHaveText('2');

    // Test del pulsante Undo (annulla ultimo tratto)
    await page.getByRole('button', { name: /Undo/i }).click();
    await expect(strokeCounter).toHaveText('1');

    // Invia lo sketch
    const submitBtn = page.getByRole('button', { name: /Invia Disegno/i });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Reindirizzamento riuscito alla Galleria
    await expect(page).toHaveURL(/\/home/);
    await expect(page.locator('h1')).toContainText(/Galleria/i);
  });

});
