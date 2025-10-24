import { test, expect } from '@playwright/test';
import path from 'path';
import { openPage } from '../../Config/navigation.js';
import { Global } from '../../Config/global.js';
import { loginAdmin } from '../../config/auth.js';

test.describe('Prestasi', () => {

    test('Tambah prestasi berhasil', async ({ page }) => {
        await loginAdmin(page);

        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        await page.click('a[data-page="prestasi"]');
        await expect(page.locator('h1', { hasText: 'PRESTASI' })).toBeVisible();

        const filePath = path.resolve('E:/Kampus/Magang/TestingUI_Web/tests/cy.jpg');
        await page.setInputFiles('input[type="file"]', filePath);

        await page.selectOption('select#juara', { label: 'Juara 1' }); 
        await page.fill('input[placeholder="Masukkan nama siswa"]', 'Jefri Nichol');
        await page.selectOption('select#kelas', { label: 'XII MIPA 1' }); 
        await page.fill('input[placeholder="Contoh: Olimpiade Matematika"]', 'Olimpiade Sains Nasional');
        await page.fill('textarea[placeholder="Masukkan deskripsi prestasi"]', 'Prestasi tingkat nasional bidang sains.');

        await page.click('button:has-text("Simpan")');

        await expect(page.locator('tbody tr', { hasText: 'ara' }).first()).toBeVisible({ timeout: 10000 });
        console.log('✅ Prestasi berhasil ditambahkan dan tampil di tabel.');
    });


    test('Edit prestasi berhasil', async ({ page }) => {
        await loginAdmin(page);

        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        await page.click('a[data-page="prestasi"]');
        await expect(page.locator('h1', { hasText: 'PRESTASI' })).toBeVisible();


        const row = page.locator('tbody tr', { hasText: 'aa' }).first();
        await row.locator('button[title="Edit"]').click();

        await page.fill('input[placeholder="Masukkan nama siswa"]', 'Jefri Nichol Edit');
        await page.fill('input[placeholder="Contoh: Olimpiade Matematika"]', 'Kompetisi Fisika');
        await page.click('button:has-text("Update")');

        await expect(page.locator('tbody tr td', { hasText: 'XII IPS 1' })).toBeVisible();
        console.log('✅ Edit prestasi berhasil');
    });


    test('Hapus prestasi berhasil', async ({ page }) => {
        await loginAdmin(page);

        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        await page.click('a[data-page="prestasi"]');
        await expect(page.locator('h1', { hasText: 'PRESTASI' })).toBeVisible();

        page.on('dialog', async (dialog) => {
            console.log('🪟 Popup:', dialog.message());
            await dialog.accept();
        });

        const row = page.locator('tbody tr', { hasText: 'Jefri Nichol Edit' }).first();
        await row.locator('button[title="Hapus"]').click();

        await page.waitForTimeout(1000);

        await expect(page.locator('tbody tr td', { hasText: 'Jefri Nichol Edit' })).toHaveCount(0);
        console.log('✅ Prestasi berhasil dihapus');
    });

});
