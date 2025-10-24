
import { test, expect } from '@playwright/test';
import path from 'path';
import { openPage } from '../../Config/navigation.js';
import { Global } from '../../Config/global.js';
import { loginAdmin } from '../../config/auth.js';

test.describe('Berita', () => {

    test('Tambah berita berhasil', async ({ page }) => {
        await loginAdmin(page);

        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        const filePath = path.resolve('E:/Kampus/Magang/TestingUI_Web/tests/cy.jpg');
        await page.setInputFiles('#fileInput', filePath, { force: true });

        await page.fill('#judul', 'hahahah');
        await page.fill('#tanggal', '2025-10-25');
        await page.fill('textarea', 'Deskripsi berita otomatis dari Playwright.');

        await page.click('button:has-text("Simpan")');

        await expect(page.locator('tbody tr', { hasText: 'hahahah' }).first()).toBeVisible({ timeout: 10000 });

        console.log('✅ Berita "hahahah" berhasil ditambahkan dan tampil di tabel.');
    });

    test('Edit berita berhasil', async ({ page }) => {
        await loginAdmin(page);

        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        const row = page.locator('tbody tr', { hasText: 'hahahah' }).first();
        await row.locator('button[title="Edit"]').click();

        await page.fill('#judul', 'Berita hasil edit');
        await page.click('button:has-text("Update")'); 

        await expect(page.locator('tbody tr td', { hasText: 'Berita hasil edit' })).toBeVisible();
        console.log('✅ Edit berita berhasil');
    });

    test('Hapus berita dengan judul "judul apa aja"', async ({ page }) => {

        await loginAdmin(page);


        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        page.on('dialog', async (dialog) => {
            const message = dialog.message();
            console.log('🪟 Popup muncul:', message);

            if (message.includes('Apakah Anda yakin ingin menghapus berita ini?')) {
                await dialog.accept();
                console.log('✅ Konfirmasi hapus disetujui');
            } else if (message.includes('Berita berhasil dihapus!')) {
                await dialog.accept();
                console.log('✅ Pesan sukses ditutup');
            } else {
                await dialog.dismiss();
            }
        });


        const row = page.locator('tbody tr', { hasText: 'Berita hasil edit' }).first();
        await row.locator('button[title="Hapus"]').click();

        await page.waitForTimeout(1500);

        await expect(page.locator('tbody tr td', { hasText: 'Berita hasil edit' })).toHaveCount(0);
        console.log('✅ Berita dengan judul "judul apa aja" berhasil dihapus');
    });


    });
