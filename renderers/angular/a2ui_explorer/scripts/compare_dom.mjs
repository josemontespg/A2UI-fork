import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page1 = await browser.newPage();
  const page2 = await browser.newPage();

  // Test flight status
  await page1.goto('http://localhost:4201/#flight-status');
  await page2.goto('http://localhost:4202/#flight-status');

  await page1.waitForTimeout(1000);
  await page2.waitForTimeout(1000);

  const html1 = await page1.locator('a2ui-v09-surface').innerHTML();
  const html2 = await page2.locator('a2ui-v09-surface').innerHTML();

  console.log('4201 HTML (first 500 chars):', html1.slice(0, 500));
  console.log('4202 HTML (first 500 chars):', html2.slice(0, 500));

  await browser.close();
}

main().catch(console.error);
