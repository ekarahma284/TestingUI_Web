
import { test, expect } from '@playwright/test';
import path from 'path';
import { openPage } from '../../Config/navigation.js';
import { Global } from '../../Config/global.js';
import { loginAdmin } from '../../config/auth.js';

test.describe('Pengumuman', () => {

    test('Tambah pengumuman berhasil', async ({ page }) => {

        await loginAdmin(page);

        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();


        await page.click('a[data-page="pengumuman"]');
        await expect(page.locator('h1', { hasText: 'Pengumuman' })).toBeVisible();


        await page.fill('#judul', 'hahahah');
        await page.fill('#tanggal', '2025-10-25');
        await page.fill('textarea', 'Deskripsi berita otomatis dari Playwright.');


        await page.click('button:has-text("Simpan")');


        await expect(page.locator('tbody tr', { hasText: 'hahahah' }).first()).toBeVisible({ timeout: 10000 });

        console.log('✅ Pengumuman "hahahah" berhasil ditambahkan dan tampil di tabel.');
    });

    test('Edit pengumuman berhasil', async ({ page }) => {
        await loginAdmin(page);


        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        await page.click('a[data-page="pengumuman"]');
        await expect(page.locator('h1', { hasText: 'Pengumuman' })).toBeVisible();


        const row = page.locator('tbody tr', { hasText: 'hahahah' }).first();
        await row.locator('button[title="Edit"]').click();


        await page.fill('#judul', 'Berita hasil edit');
        await page.click('button:has-text("Update")');


        await expect(page.locator('tbody tr td', { hasText: 'Berita hasil edit' })).toBeVisible();
        console.log('✅ Edit berita berhasil');
    });

    test('Hapus pengumuman dengan judul "judul apa aja"', async ({ page }) => {

        await loginAdmin(page);


        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();


        await page.click('a[data-page="pengumuman"]');
        await expect(page.locator('h1', { hasText: 'Pengumuman' })).toBeVisible();


        page.on('dialog', async (dialog) => {
            const message = dialog.message();
            console.log('🪟 Popup muncul:', message);

            if (message.includes('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
                await dialog.accept();
                console.log('✅ Konfirmasi hapus disetujui');
            } else if (message.includes('Pengumuman berhasil dihapus!')) {
                await dialog.accept();
                console.log('✅ Pesan sukses ditutup');
            } else {
                await dialog.dismiss();
            }
        });

        const row = page.locator('tbody tr', { hasText: 'hgciowjnv' }).first();
        await row.locator('button[title="Hapus"]').click();

        await page.waitForTimeout(1500);

        await expect(page.locator('tbody tr td', { hasText: 'hgciowjnv' })).toHaveCount(0);
        console.log('✅ Berita dengan judul "judul apa aja" berhasil dihapus');
    });
});