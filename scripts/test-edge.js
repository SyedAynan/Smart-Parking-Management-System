const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
    });
    console.log('Playwright successfully launched Edge Chromium! Version:', browser.version());
    await browser.close();
  } catch (err) {
    console.error('Launch failed:', err);
  }
})();
