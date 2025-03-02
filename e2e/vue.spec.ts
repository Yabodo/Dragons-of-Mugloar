import { test, expect } from '@playwright/test'

test('complete manual game flow', async ({ page }) => {
  await page.goto('/play')

  await page.content()

  // Wait for game to load
  await expect(page.locator('.stat-bar')).toBeVisible()

  // Test accepting two ads
  const acceptButton = page.locator('button:has-text("Accept")').first()
  await acceptButton.click()
  await acceptButton.click()

  // Verify game state updates
  await expect(page.locator('.ad-result')).toBeVisible()

  // Test buying an item
  const buyButton = page.locator('button:has-text("Buy")').first()
  await buyButton.click()
})

test('complete automatic game flow', async ({ page }) => {
  // Helper function to get score (5th stat)
  async function getGameScore() {
    const scoreText = await page
      .locator('.stat-bar .tooltip')
      .nth(4)
      .locator('.game-stat p')
      .textContent()
    return Number(scoreText)
  }

  await page.goto('/autoplay')

  await page.content()

  // Wait for game to load
  await expect(page.locator('.stat-bar')).toBeVisible()

  // Check for initial score
  const gameStartScore = await getGameScore()

  // Test starting auto-play
  const startButton = page.locator('button:has-text("Start Auto-Play")').first()
  await startButton.click()

  // Test for score differences
  await expect(async () => {
    const gameEndScore = await getGameScore()
    expect(gameEndScore).toBeGreaterThan(gameStartScore)
  }).toPass({ timeout: 10_000 })
})
