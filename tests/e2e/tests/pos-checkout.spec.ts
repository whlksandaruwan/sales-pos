import { test, expect } from '@playwright/test';

test('scan and checkout flow', async ({ page }) => {
  await page.goto('http://localhost:5173/pos');
  const scanInput = page.getByLabel('Scan barcode');
  await expect(scanInput).toBeVisible();
  // In a real test, mocking backend or using a seeded DB would be required
});


