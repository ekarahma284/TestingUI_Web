// config/navigation.js
import { Global } from './global.js';

export async function openPage(page, pathOrFullUrl = '') {
  // Jika path sudah berupa URL lengkap (misal diawali "https://"), pakai langsung
  const fullUrl = pathOrFullUrl.startsWith('http')
    ? pathOrFullUrl
    : `${Global.BASE_URL}${pathOrFullUrl}`;

  await page.goto(fullUrl);
  console.log(`✅ Navigated to: ${fullUrl}`);
}
