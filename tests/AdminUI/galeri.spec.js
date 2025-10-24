

import { test, expect } from '@playwright/test';
import path from 'path';
import { openPage } from '../../Config/navigation.js';
import { Global } from '../../Config/global.js';
import { loginAdmin } from '../../config/auth.js';



test.describe('Galeri', () => {
    test('Tambah galeri berhasil', async ({ page }) => {
        await loginAdmin(page);


        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        await page.click('a[data-page="galeri"]');
        await expect(page.locator('h1', { hasText: 'galeri' })).toBeVisible();


        const filePath = path.resolve('E:/Kampus/Magang/TestingUI_Web/tests/cy.jpg');
        await page.setInputFiles('input[type="file"]', filePath);


        await page.fill('input[placeholder="Masukkan judul galeri"]', 'Foto event sekolah');


        await page.click('button:has-text("Simpan")');


        await expect(page.locator('tbody tr', { hasText: 'Foto event sekolah' }).first()).toBeVisible({ timeout: 10000 });

        console.log('✅ Galeri "Foto event sekolah" berhasil ditambahkan dan tampil di tabel.');
    });


    test('Edit galeri berhasil', async ({ page }) => {
        await loginAdmin(page);

        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        await page.click('a[data-page="galeri"]');
        await expect(page.locator('h1', { hasText: 'galeri' })).toBeVisible();

        const row = page.locator('tbody tr', { hasText: 'Foto event sekolah' }).first();
        await row.locator('button[title="Edit"]').click();


        await page.fill('input[placeholder="Masukkan judul galeri"]', 'Foto event sekolah hasil edit');
        await page.click('button:has-text("Update")');


        await expect(page.locator('tbody tr td', { hasText: 'Foto event sekolah hasil edit' })).toBeVisible();
        console.log('✅ Edit galeri berhasil');
    });


    test('Hapus galeri berhasil', async ({ page }) => {
         await loginAdmin(page);

        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        await page.click('a[data-page="galeri"]');
        await expect(page.locator('h1', { hasText: 'galeri' })).toBeVisible();
        
        page.on('dialog', async (dialog) => {
            const message = dialog.message();
            console.log('🪟 Popup muncul:', message);
            await dialog.accept();
        });

        const row = page.locator('tbody tr', { hasText: 'Foto event sekolah hasil edit' }).first();
        await row.locator('button[title="Hapus"]').click();

        await page.waitForTimeout(1000);


        await expect(page.locator('tbody tr td', { hasText: 'Foto event sekolah hasil edit' })).toHaveCount(0);
        console.log('✅ Galeri berhasil dihapus');
    });
});