import { test, expect } from '@playwright/test';

test('homepage renders hero heading and CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/landscapes built/i);
  await expect(page.getByRole('link', { name: /free estimate/i }).first()).toBeVisible();
});

test('service detail page renders for lawn-care', async ({ page }) => {
  await page.goto('/services/lawn-care');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/lawn care/i);
});

test('legacy WordPress URL /lawn-care redirects to /services/lawn-care', async ({ page }) => {
  const response = await page.goto('/lawn-care');
  expect(response?.url()).toMatch(/\/services\/lawn-care\/?$/);
});

test('services index lists all four categories', async ({ page }) => {
  await page.goto('/services');
  await expect(page.getByRole('heading', { name: 'Landscaping', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lawn', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hardscaping', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Other Services', level: 2 })).toBeVisible();
});

test('gallery opens lightbox on image click and closes on Escape', async ({ page }) => {
  await page.goto('/gallery');
  await page.getByRole('button', { name: /open image/i }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('gallery lightbox Next/Prev advance images without page navigation', async ({ page }) => {
  await page.goto('/gallery');
  await page.getByRole('button', { name: /open image/i }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const initialSrc = await dialog.locator('img').getAttribute('src');

  await page.getByRole('button', { name: 'Next image' }).click();
  // URL must not change — the original bug was that arrows navigated to /
  await expect(page).toHaveURL(/\/gallery\/?$/);
  await expect(dialog).toBeVisible();
  const afterNextSrc = await dialog.locator('img').getAttribute('src');
  expect(afterNextSrc).not.toBe(initialSrc);

  await page.getByRole('button', { name: 'Previous image' }).click();
  await expect(page).toHaveURL(/\/gallery\/?$/);
  await expect(dialog).toBeVisible();
});

test('contact form rejects submission without required fields', async ({ page }) => {
  await page.goto('/contact');
  // Required HTML5 validation prevents server submission; just confirm we stay on page
  await page.getByRole('button', { name: /send request/i }).click();
  await expect(page).toHaveURL(/\/contact\/?$/);
});
