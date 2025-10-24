
import { Global } from './global.js';

export async function openPage(page, pathOrFullUrl = '') {
  const fullUrl = pathOrFullUrl.startsWith('http')
    ? pathOrFullUrl
    : `${Global.BASE_URL}${pathOrFullUrl}`;

  await page.goto(fullUrl);
  console.log(`✅ Navigated to: ${fullUrl}`);
}
