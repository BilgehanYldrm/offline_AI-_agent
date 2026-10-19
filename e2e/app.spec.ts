import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Make the local-data smoke tests independent of external map/video services.
  await page.route(/^https:\/\//, route => route.abort());
  await page.goto('/');
});

test('dashboard, language selector and real local retrieval', async ({ page }) => {
  await expect(page.getByText('PORTFÖY DEMOSU', { exact: false })).toBeVisible();
  await expect(page.locator('main > div').first()).toHaveCSS('opacity', '1');
  await page.screenshot({ path: 'docs/screenshots/dashboard.png', fullPage: true });
  await page.getByRole('button', { name: 'Change language' }).click();
  await expect(page.getByText('PORTFOLIO DEMO •', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Change language' }).click();
  await page.getByRole('button', { name: 'Change language' }).click();
  await page.getByRole('button', { name: 'Asistan', exact: true }).click();
  await page.getByRole('textbox', { name: 'Assistant question' }).fill('deprem çantası');
  await page.getByRole('button', { name: 'SOR', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('DEPREM ÇANTASINDA BULUNMASI GEREKENLER');
  await page.screenshot({ path: 'docs/screenshots/assistant.png', fullPage: false });
  await page.getByRole('textbox', { name: 'Assistant question' }).fill('xyz123');
  await page.getByRole('button', { name: 'SOR', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('eşleşme bulunamadı');
});

test('map search handles every point including Bursa', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('button', { name: /Afet Durumu/ }).click();
  await page.getByRole('button', { name: 'Deprem', exact: true }).click();
  await page.getByPlaceholder('Şehir ismi arayın...').fill('Bursa');
  await expect(page.getByText('Yıldırım', { exact: false }).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('backend failure is shown as an error', async ({ page }) => {
  await page.route('**/api/soru-sor', route => route.fulfill({ status: 503, body: '{}' }));
  await page.getByRole('button', { name: 'Asistan', exact: true }).click();
  await page.getByRole('textbox', { name: 'Assistant question' }).fill('deprem');
  await page.getByRole('button', { name: 'SOR', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('bağlanılamadı');
  await expect(page.getByRole('status')).not.toContainText('DEPREM ANINDA');
});

test('mobile dashboard fits viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('button', { name: 'Asistan', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await expect(page.locator('header h1')).toBeInViewport();
  const headerBounds = await page.locator('header h1').boundingBox();
  expect(headerBounds!.y).toBeGreaterThanOrEqual(0);
  expect(headerBounds!.y + headerBounds!.height).toBeLessThanOrEqual(80);
  await page.screenshot({ path: 'docs/screenshots/mobile.png', fullPage: true });
});
