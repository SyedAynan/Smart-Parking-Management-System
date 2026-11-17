const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const tabs = await page.locator('[role="tab"]').all();
  console.log('Found tabs:', tabs.length);
  for (let i = 0; i < tabs.length; i++) {
    console.log(`Tab ${i}:`, await tabs[i].innerText());
  }

  console.log('Clicking Debug tab (nth 1)...');
  await tabs[1].click();
  await page.waitForTimeout(1000);

  // Check what is rendered
  const debugText = await page.locator('.min-h-screen').innerText();
  console.log('Contains State Machine:', debugText.includes('State Machine') || debugText.includes('STATE_'));
  console.log('Contains Hardware Flags:', debugText.includes('Flags') || debugText.includes('FLAG'));
  console.log('Contains Debug Console:', debugText.includes('Console') || debugText.includes('Debug'));

  // Take screenshot
  await page.screenshot({ path: 'S:\\Smart-Parking-Management-System\\debug_tab_view.png' });
  console.log('Saved debug_tab_view.png');

  await browser.close();
})();
