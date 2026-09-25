import { test, expect } from '@playwright/test';

test.describe('01 - Landing Page & Guest Mode', () => {

  test('Test 1: Caricamento Landing Page e navigazione Ospite verso la Galleria', async ({ page }) => {
    await page.goto('/');

    // Verifica controlli principali della Landing page
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Disegna Veloce/i);

    const authButton = page.getByRole('button', { name: /Accedi \/ Registrati/i });
    const guestLink = page.getByRole('link', { name: /Entra come Ospite/i });
    await expect(authButton).toBeVisible();
    await expect(guestLink).toBeVisible();

    // Click su "Entra come Ospite" e reindirizzamento alla Home Galleria
    await guestLink.click();
    await expect(page).toHaveURL(/\/home/);

    // Verifica intestazione Galleria
    await expect(page.locator('h1')).toContainText(/Galleria/i);

    // Verifica indicatore Ospite nella sidebar
    const guestBadge = page.getByText(/Ospite|Guest/i).first();
    await expect(guestBadge).toBeVisible();

    // Verifica presenza del bottone "Accedi / Registrati" nella sidebar
    await expect(page.getByRole('button', { name: /Accedi \/ Registrati/i })).toBeVisible();
  });

  test('Test 2: Blocco Ospiti su percorsi riservati (Guest Lock)', async ({ page }) => {
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
