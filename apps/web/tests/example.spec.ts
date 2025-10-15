import { test, expect } from '@playwright/test'

test('homepage has Dashboard link', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('text=Dashboard')).toBeVisible()
})
