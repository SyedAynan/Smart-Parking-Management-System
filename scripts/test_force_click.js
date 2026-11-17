const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  function switchTab(index) {
    return page.evaluate((idx) => {
      const tab = document.querySelectorAll('[role="tab"]')[idx];
      if (!tab) return false;
      tab.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
      tab.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      tab.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
      tab.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
      tab.click();
      return true;
    }, index);
  }

  console.log('Switch to Tab 1 (Debug)...');
  await switchTab(1);
  await page.waitForTimeout(600);
  console.log('Has STATE MACHINE:', await page.locator('text=STATE MACHINE').count() > 0);

  console.log('Switch to Tab 0 (Simulation)...');
  await switchTab(0);
  await page.waitForTimeout(600);
  console.log('Has Parking Lot:', await page.locator('text=Parking Lot (32 Slots)').count() > 0);

  await browser.close();
})();
