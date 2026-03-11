import { test, expect } from '@playwright/test';

test.describe('Donation Flow', () => {
    test('should login as admin and donate to a campaign', async ({ page }) => {
        // 1. Login as Admin
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@gmail.com');
        await page.fill('input[type="password"]', 'admin123');

        // Solve Login CAPTCHA
        const loginCaptcha = await page.textContent('.user-select-none');
        const logParts = loginCaptcha.match(/(\d+)\s*\+\s*(\d+)/);
        if (logParts) {
            const ans = parseInt(logParts[1]) + parseInt(logParts[2]);
            await page.fill('input[placeholder="Enter answer"]', ans.toString());
        }

        await page.click('button[type="submit"]');

        // VERIFY LOGIN SUCCESS
        await expect(page.getByText('Requesting Admin')).toBeVisible();

        // 2. Go to Campaigns
        await page.goto('/campaigns');

        // 3. Click "View Details" (Link inside Card)
        const campaignCard = page.locator('.card').first();
        await campaignCard.locator('a[href^="/campaigns/"]').click();

        // 4. Click Donate on Detail Page
        await expect(page).toHaveURL(/\/campaigns\/\d+/);

        // Wait for the "Donate Now" button to be visible and enabled
        const donateButton = page.locator('button:has-text("Donate Now")');
        await expect(donateButton).toBeVisible();
        await donateButton.click();

        // 5. Fill Donation Form
        await expect(page.getByRole('dialog')).toBeVisible(); // Modal check

        // Enter custom amount
        await page.fill('input[placeholder="Enter custom amount"]', '500');

        // Click Donate Button (Text changes dynamically to "Donate ₹500")
        const processDonationButton = page.locator('button:has-text("Donate ₹500")');
        await processDonationButton.click();

        // 6. Success
        // Wait for "Thank You!"
        await expect(page.getByText('Thank You!')).toBeVisible({ timeout: 15000 });
    });
});
