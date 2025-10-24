
import { expect } from '@playwright/test';
import { Global } from 'global.js';

export async function loginAdmin(page) {

  await page.goto(Global.ADMIN_LOGIN);

  await page.fill('#username', 'adm');      
  await page.fill('#password', 'abcd');     

  await page.click('button:has-text("Login")');

  await page.waitForURL(Global.ADMIN_BERITA, { timeout: 30000 });

  await expect(page).toHaveURL(Global.ADMIN_BERITA);

  console.log('✅ Login admin berhasil');
}
