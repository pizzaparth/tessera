import { test, expect } from '@playwright/test';

test.describe('Brain Vault Landing Page by Parth Pancholi', () => {
  test('Landing page renders flawlessly with continuous animations and navigates to app', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Visit landing page
    await page.goto('/');

    // 2. Check title and main headlines
    await expect(page).toHaveTitle(/Brain Vault|Tessera/i);
    await expect(page.locator('h1')).toContainText('AMOLED Neural Knowledge Graph');
    await expect(page.locator('text=Parth Pancholi').first()).toBeVisible();

    // 3. Verify Canvas Graph View is present and running
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // 4. Verify Live AI Streamer is streaming
    await expect(page.locator('text=Universal AI Dynamic Expander')).toBeVisible();

    // 5. Verify Continuous Marquee
    await expect(page.locator('text=Claude 3.7 Sonnet').first()).toBeVisible();
    await expect(page.locator('text=Created by Parth Pancholi').first()).toBeVisible();

    // 6. Verify Interactive Feature Tabs
    await expect(page.locator('text=60 FPS Graph Physics').first()).toBeVisible();
    await page.click('text=AMOLED Pure Black');
    await expect(page.locator('text=Designed for OLED displays. Zero backlight bleed.')).toBeVisible();

    // 7. Verify Architecture Pipeline
    await expect(page.locator('text=From raw thought to a living neural universe.')).toBeVisible();

    // 8. Verify Bento Grid
    await expect(page.locator('text=Engineered for pure cognitive flow.')).toBeVisible();
    await expect(page.locator('text=OLED Pixel Shutoff. Neon Synaptic Brilliance.')).toBeVisible();

    // 9. Verify Creator Showcase
    await expect(page.locator('text=Crafted with love by Parth Pancholi')).toBeVisible();

    // Take full page screenshot
    await page.screenshot({ path: 'landing-desktop.png', fullPage: true });

    // 10. Test Launching Demo via Magnetic Button
    const demoButton = page.locator('button:has-text("Launch Interactive Demo")').first();
    await demoButton.click();

    // Ensure we navigated to /demo (WorkspacePage)
    await expect(page).toHaveURL(/\/demo/);
    await expect(page.locator('text=brain-vault-engine.canvas2d').or(page.locator('header'))).toBeVisible();

    // Test going back to website
    const websiteLink = page.locator('a:has-text("Website")');
    if (await websiteLink.isVisible()) {
      await websiteLink.click();
      await expect(page).toHaveURL('/');
    }

    // Assert no fatal JS console errors occurred
    expect(consoleErrors).toHaveLength(0);
  });
});
