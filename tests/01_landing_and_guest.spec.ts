import { test, expect } from '@playwright/test';

test.describe('01 - Landing Page & Guest Mode', () => {

  test('Test 1: Caricamento iniziale della Landing page e controlli grafici', async ({ page }) => {
    await page.goto('/');

    // Verifica titolo principale
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Disegna Veloce/i);

    // Verifica pulsanti CTA
    const authButton = page.getByRole('button', { name: /Accedi \/ Registrati/i });
    const guestLink = page.getByRole('link', { name: /Entra come Ospite/i });
    await expect(authButton).toBeVisible();
    await expect(guestLink).toBeVisible();

    // Verifica presenza immagine dimostrativa
    const raccoonImg = page.locator('img[alt*="Procione"]');
    await expect(raccoonImg).toBeVisible();
  });

  test('Test 2: Navigazione come Ospite verso la Galleria', async ({ page }) => {
    await page.goto('/');

    // Click su "Entra come Ospite"
    await page.getByRole('link', { name: /Entra come Ospite/i }).click();

    // Reindirizzamento alla Home Gallery
    await expect(page).toHaveURL(/\/home/);

    // Verifica intestazione Galleria
    await expect(page.locator('h1')).toContainText(/Galleria/i);

    // Verifica indicatore Ospite nella sidebar (desktop)
    const guestBadge = page.locator('text=Guest').first();
    await expect(guestBadge).toBeVisible();

    // Verifica presenza del bottone "Accedi / Registrati" nella sidebar
    await expect(page.getByRole('button', { name: /Accedi \/ Registrati/i })).toBeVisible();
  });

  test('Test 3: Blocco Ospiti su percorsi riservati (Guest Lock)', async ({ page }) => {
    // Navigazione diretta da ospite all'area disegno /draw
    await page.goto('/draw');
    await expect(page.locator('h2')).toContainText(/Area di disegno bloccata/i);
    await expect(page.locator('text=Devi essere registrato per pubblicare disegni')).toBeVisible();

    // Navigazione diretta da ospite al profilo /profile
    await page.goto('/profile');
    await expect(page.locator('h2')).toContainText(/Statistiche bloccate/i);
    await expect(page.locator('text=Sei attualmente connesso come Ospite')).toBeVisible();
  });

});
