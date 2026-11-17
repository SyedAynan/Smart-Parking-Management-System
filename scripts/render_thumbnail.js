const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log("🎨 Launching Playwright to render authentic thumbnails...");
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  // 1. Render 1920x1080 Landscape Full HD Thumbnail
  const page1080 = await browser.newPage({ 
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const url16x9 = 'file:///' + path.resolve(__dirname, 'thumbnail_generator.html').replace(/\\/g, '/');
  await page1080.goto(url16x9, { waitUntil: 'networkidle' });
  await page1080.waitForTimeout(800);
  await page1080.screenshot({ path: "S:\\ParkCore_Authentic_Thumbnail_1080p.png" });
  console.log("✅ Rendered S:\\ParkCore_Authentic_Thumbnail_1080p.png");

  // 2. Render 4K Landscape Master (3840x2160)
  const page4K = await browser.newPage({ 
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });
  await page4K.goto(url16x9, { waitUntil: 'networkidle' });
  await page4K.waitForTimeout(800);
  await page4K.screenshot({ path: "S:\\ParkCore_Authentic_Thumbnail_4K.png" });
  console.log("✅ Rendered S:\\ParkCore_Authentic_Thumbnail_4K.png");

  // 3. Render 1080x1350 Mobile 4:5 Edition
  const page4x5 = await browser.newPage({ 
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1
  });
  const url4x5 = 'file:///' + path.resolve(__dirname, 'thumbnail_generator_4x5.html').replace(/\\/g, '/');
  await page4x5.goto(url4x5, { waitUntil: 'networkidle' });
  await page4x5.waitForTimeout(800);
  await page4x5.screenshot({ path: "S:\\ParkCore_Authentic_Thumbnail_4x5.png" });
  console.log("✅ Rendered S:\\ParkCore_Authentic_Thumbnail_4x5.png");

  await browser.close();
  console.log("🎉 All thumbnails successfully rendered!");
})();
