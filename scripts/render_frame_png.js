const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1728, height: 2160 }, deviceScaleFactor: 1 });
  const fileUrl = 'file:///' + path.resolve(__dirname, 'linkedin_frame.html').replace(/\\/g, '/');
  console.log("Loading", fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const outPath = "S:\\linkedin_frame_1728x2160.png";
  await page.screenshot({ path: outPath, omitBackground: false });
  console.log("? LinkedIn Frame Screenshot saved to", outPath);
  await browser.close();
})();
