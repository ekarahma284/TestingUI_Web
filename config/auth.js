// config/auth.js
import { expect } from '@playwright/test';
import { Global } from './global.js';

export async function loginAdmin(page) {
  // Buka halaman login admin
  await page.goto(Global.ADMIN_LOGIN);

  // Isi form login
  await page.fill('#username', 'adm');      
  await page.fill('#password', 'abcd');     

  // Klik tombol login
  await page.click('button:has-text("Login")');

  // Tunggu sampai halaman tambah berita terbuka
  await page.waitForURL(Global.ADMIN_BERITA, { timeout: 30000 });

  // Pastikan sudah login berhasil
  await expect(page).toHaveURL(Global.ADMIN_BERITA);

  console.log('✅ Login admin berhasil');
}
