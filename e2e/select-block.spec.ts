import { expect, test } from '@playwright/test'

test('shows the type and position of a clicked block', async ({ page }) => {
  await page.goto('/')

  const panel = page.getByRole('complementary', { name: 'Selected block' })
  await expect(panel).toContainText('Click a block to inspect it.')

  await page.locator('canvas').click()

  await expect(panel).toContainText(/Type\s*(Ore|Waste|Soil)/)
  await expect(panel).toContainText(/Position\s*X -?\d+\.\d · Y -?\d+\.\d · Z -?\d+\.\d/)
})
