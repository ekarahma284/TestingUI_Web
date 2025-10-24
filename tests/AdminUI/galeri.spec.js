
// tests/AdminUI/test.spec.js
import { test, expect } from '@playwright/test';
import path from 'path';
import { openPage } from '../../Config/navigation.js';
import { Global } from '../../Config/global.js';
import { loginAdmin } from '../../config/auth.js';



test.describe('Galeri', () => {
    test('Tambah galeri berhasil', async ({ page }) => {
        await loginAdmin(page);

        // 🔹 Buka halaman utama admin (misalnya halaman berita)
        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        // 🔹 Klik menu sidebar “Pengumuman”
        await page.click('a[data-page="galeri"]');
        await expect(page.locator('h1', { hasText: 'galeri' })).toBeVisible();

        // 🔹 Upload gambar
        const filePath = path.resolve('E:/Kampus/Magang/TestingUI_Web/tests/cy.jpg');
        await page.setInputFiles('input[type="file"]', filePath);

        // 🔹 Isi judul galeri
        await page.fill('input[placeholder="Masukkan judul galeri"]', 'Foto event sekolah');

        // 🔹 Klik tombol Simpan
        await page.click('button:has-text("Simpan")');

        // 🔹 Pastikan data tampil di tabel "Data Galeri"
        await expect(page.locator('tbody tr', { hasText: 'Foto event sekolah' }).first()).toBeVisible({ timeout: 10000 });

        console.log('✅ Galeri "Foto event sekolah" berhasil ditambahkan dan tampil di tabel.');
    });


    test('Edit galeri berhasil', async ({ page }) => {
        await loginAdmin(page);

        // 🔹 Buka halaman utama admin (misalnya halaman berita)
        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        // 🔹 Klik menu sidebar “Pengumuman”
        await page.click('a[data-page="galeri"]');
        await expect(page.locator('h1', { hasText: 'galeri' })).toBeVisible();

        // Klik tombol edit pada baris berisi galeri
        const row = page.locator('tbody tr', { hasText: 'Foto event sekolah' }).first();
        await row.locator('button[title="Edit"]').click();

        // Edit judul
        await page.fill('input[placeholder="Masukkan judul galeri"]', 'Foto event sekolah hasil edit');
        await page.click('button:has-text("Update")');

        // Pastikan perubahan muncul
        await expect(page.locator('tbody tr td', { hasText: 'Foto event sekolah hasil edit' })).toBeVisible();
        console.log('✅ Edit galeri berhasil');
    });


    test('Hapus galeri berhasil', async ({ page }) => {
         await loginAdmin(page);

        // 🔹 Buka halaman utama admin (misalnya halaman berita)
        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        // 🔹 Klik menu sidebar “Pengumuman”
        await page.click('a[data-page="galeri"]');
        await expect(page.locator('h1', { hasText: 'galeri' })).toBeVisible();
        
        // Dengarkan dialog popup konfirmasi
        page.on('dialog', async (dialog) => {
            const message = dialog.message();
            console.log('🪟 Popup muncul:', message);
            await dialog.accept();
        });

        // Klik tombol hapus berdasarkan judul
        const row = page.locator('tbody tr', { hasText: 'Foto event sekolah hasil edit' }).first();
        await row.locator('button[title="Hapus"]').click();

        // Tunggu proses selesai
        await page.waitForTimeout(1000);

        // Pastikan galeri sudah terhapus
        await expect(page.locator('tbody tr td', { hasText: 'Foto event sekolah hasil edit' })).toHaveCount(0);
        console.log('✅ Galeri berhasil dihapus');
    });
});