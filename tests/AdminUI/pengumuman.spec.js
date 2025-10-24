// tests/AdminUI/test.spec.js
import { test, expect } from '@playwright/test';
import path from 'path';
import { openPage } from '../../Config/navigation.js';
import { Global } from '../../Config/global.js';
import { loginAdmin } from '../../config/auth.js';

test.describe('Pengumuman', () => {

    test('Tambah pengumuman berhasil', async ({ page }) => {
        // 🔹 Login admin dulu
        await loginAdmin(page);

        // 🔹 Buka halaman utama admin (misalnya halaman berita)
        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        // 🔹 Klik menu sidebar “Pengumuman”
        await page.click('a[data-page="pengumuman"]');
        await expect(page.locator('h1', { hasText: 'Pengumuman' })).toBeVisible();

        // 🔹 Isi form tambah pengumuman
        await page.fill('#judul', 'hahahah');
        await page.fill('#tanggal', '2025-10-25');
        await page.fill('textarea', 'Deskripsi berita otomatis dari Playwright.');

        // 🔹 Klik tombol simpan
        await page.click('button:has-text("Simpan")');

        // 🔹 Tunggu sampai data tampil di tabel
        await expect(page.locator('tbody tr', { hasText: 'hahahah' }).first()).toBeVisible({ timeout: 10000 });

        console.log('✅ Pengumuman "hahahah" berhasil ditambahkan dan tampil di tabel.');
    });

    test('Edit pengumuman berhasil', async ({ page }) => {
        await loginAdmin(page);

        // Buka halaman berita
        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();

        await page.click('a[data-page="pengumuman"]');
        await expect(page.locator('h1', { hasText: 'Pengumuman' })).toBeVisible();

        // Klik tombol Edit berdasarkan atribut title
        const row = page.locator('tbody tr', { hasText: 'hahahah' }).first();
        await row.locator('button[title="Edit"]').click();

        // Edit isi form
        await page.fill('#judul', 'Berita hasil edit');
        await page.click('button:has-text("Update")'); // pastikan tombolnya punya teks Update

        // Pastikan data hasil edit muncul di tabel
        await expect(page.locator('tbody tr td', { hasText: 'Berita hasil edit' })).toBeVisible();
        console.log('✅ Edit berita berhasil');
    });

    test('Hapus pengumuman dengan judul "judul apa aja"', async ({ page }) => {
        // 🔹 Login admin terlebih dahulu
        await loginAdmin(page);

        // 🔹 Buka halaman berita
        await page.goto(Global.ADMIN_BERITA);
        await expect(page.locator('h1', { hasText: 'Berita' })).toBeVisible();


        await page.click('a[data-page="pengumuman"]');
        await expect(page.locator('h1', { hasText: 'Pengumuman' })).toBeVisible();

        // 🔹 Dengarkan event pop-up (alert & confirm)
        page.on('dialog', async (dialog) => {
            const message = dialog.message();
            console.log('🪟 Popup muncul:', message);

            if (message.includes('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
                await dialog.accept(); // klik OK pada konfirmasi hapus
                console.log('✅ Konfirmasi hapus disetujui');
            } else if (message.includes('Pengumuman berhasil dihapus!')) {
                await dialog.accept(); // klik OK setelah berhasil
                console.log('✅ Pesan sukses ditutup');
            } else {
                await dialog.dismiss(); // jaga-jaga kalau ada popup lain
            }
        });

        // 🔹 Klik tombol hapus berdasarkan judul berita
        const row = page.locator('tbody tr', { hasText: 'hgciowjnv' }).first();
        await row.locator('button[title="Hapus"]').click();

        // 🔹 Tunggu proses selesai
        await page.waitForTimeout(1500);

        // 🔹 Pastikan berita sudah hilang dari tabel
        await expect(page.locator('tbody tr td', { hasText: 'hgciowjnv' })).toHaveCount(0);
        console.log('✅ Berita dengan judul "judul apa aja" berhasil dihapus');
    });
});