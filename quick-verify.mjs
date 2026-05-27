import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();
  
  await page.goto('http://localhost:5174/');
  await page.waitForTimeout(500);
  
  await page.fill('.todo-input', 'Test Enter key');
  await page.press('.todo-input', 'Enter');
  await page.waitForTimeout(300);
  
  const todoCount = await page.locator('.todo-item').count();
  console.log(todoCount === 1 ? '✅ Enter key works correctly after fix' : '❌ Enter key broken');
  
  await browser.close();
})();
