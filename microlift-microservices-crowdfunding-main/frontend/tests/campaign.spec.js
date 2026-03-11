import { test, expect } from '@playwright/test';

test.describe('Campaign Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login as Admin (who is also a beneficiary) for simplicity, or create a specific user
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@gmail.com');
        await page.fill('input[type="password"]', 'admin123');
        // Solve Math CAPTCHA
        const captchaText = await page.textContent('.user-select-none');
        const parts = captchaText.match(/(\d+)\s*\+\s*(\d+)/);
        if (parts) {
            const answer = parseInt(parts[1]) + parseInt(parts[2]);
            await page.fill('input[placeholder="Enter answer"]', answer.toString());
        }
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should create a new campaign', async ({ page }) => {
        await page.goto('/create-campaign');

        await page.fill('input[name="title"]', 'Playwright Test Campaign ' + Date.now());
        await page.selectOption('select[name="category"]', 'EDUCATION');
        await page.fill('input[name="goalAmount"]', '50000');
        await page.fill('textarea[name="description"]', 'This is an automated test campaign.');

        // Set End Date (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        await page.fill('input[name="endDate"]', dateStr);

        await page.fill('input[name="location"]', 'Test City');

        // File Uploads (Mocking or real file)
        // We need to create dummy files for upload
        await page.setInputFiles('input[type="file"][accept="image/*"]', {
            name: 'thumb.png',
            mimeType: 'image/png',
            buffer: Buffer.from('this is a test image')
        });

        await page.setInputFiles('input[type="file"][multiple]', {
            name: 'doc.pdf',
            mimeType: 'application/pdf',
            buffer: Buffer.from('this is a test doc')
        });

        await page.click('button[type="submit"]');

        // Expect success message or redirect
        await expect(page.getByRole('alert')).toContainText('Submitted Successfully');
        await expect(page).toHaveURL(/.*dashboard/);
    });
});
