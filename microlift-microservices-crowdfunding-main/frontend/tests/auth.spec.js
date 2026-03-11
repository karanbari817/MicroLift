import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should login as admin successfully', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@gmail.com');
        await page.fill('input[type="password"]', 'admin123');

        // Solve Math CAPTCHA
        const captchaText = await page.textContent('.user-select-none');
        // Format: "num1 + num2 = ?"
        const parts = captchaText.match(/(\d+)\s*\+\s*(\d+)/);
        if (parts) {
            const answer = parseInt(parts[1]) + parseInt(parts[2]);
            await page.fill('input[placeholder="Enter answer"]', answer.toString());
        } else {
            console.error('CAPTCHA text not found or parsed:', captchaText);
        }

        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*dashboard/);
        await expect(page.getByText('Admin Dashboard')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpass');
        // Solve Math CAPTCHA
        const captchaText = await page.textContent('.user-select-none');
        const parts = captchaText.match(/(\d+)\s*\+\s*(\d+)/);
        if (parts) {
            const answer = parseInt(parts[1]) + parseInt(parts[2]);
            await page.fill('input[placeholder="Enter answer"]', answer.toString());
        }
        await page.click('button[type="submit"]');

        await expect(page.getByRole('alert')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@gmail.com');
        await page.fill('input[type="password"]', 'admin123');
        const captchaText = await page.textContent('.user-select-none');
        const parts = captchaText.match(/(\d+)\s*\+\s*(\d+)/);
        if (parts) {
            const answer = parseInt(parts[1]) + parseInt(parts[2]);
            await page.fill('input[placeholder="Enter answer"]', answer.toString());
        }
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/.*dashboard/);

        // Logout
        // Open User Dropdown
        await page.click('#basic-nav-dropdown');
        // Click Logout (Dropdown Item)
        await page.click('text=Logout');
        await expect(page).toHaveURL('/');
    });
});
