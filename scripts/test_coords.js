const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('--- SIMULATION TAB ---');
  const elements = [
    { name: 'KPI Ribbon', sel: '.grid.grid-cols-2.md\\:grid-cols-5' },
    { name: 'Simulation Control', sel: 'text=Simulation Control' },
    { name: 'Operator Console', sel: 'text=Vehicle Dispatch' },
    { name: 'Bay HUD', sel: 'text=Bay Hardware Telemetry' },
    { name: 'Smart Gate Plaza', sel: 'text=Highway Toll Plaza' },
    { name: 'Parking Lot Grid', sel: 'text=Parking Lot (32 Slots)' },
    { name: 'Event Log', sel: 'text=Real-Time Event Stream' },
    { name: 'Vehicle Distribution', sel: 'text=Vehicle Distribution' },
    { name: 'Hardware Diagnostics / Registers', sel: 'text=Hardware Diagnostic Registers' },
    { name: 'Session Analytics', sel: 'text=Session Analytics' },
    { name: 'Debug Tab Button', sel: 'button[role="tab"]:has-text("Debug")' }
  ];

  for (const el of elements) {
    try {
      const loc = page.locator(el.sel).first();
      const count = await loc.count();
      if (count > 0) {
        const box = await loc.boundingBox();
        console.log(el.name, '=>', box ? `(${Math.round(box.x)}, ${Math.round(box.y)}, ${Math.round(box.width)}x${Math.round(box.height)})` : 'NO BOX');
      } else {
        console.log(el.name, '=> NOT FOUND (count=0)');
      }
    } catch (e) {
      console.log(el.name, '=> ERROR:', e.message);
    }
  }

  // Click Debug Tab
  console.log('--- DEBUG TAB ---');
  await page.click('button[role="tab"]:has-text("Debug")');
  await page.waitForTimeout(500);

  const debugElements = [
    { name: 'FSM State Machine', sel: 'text=14-State FSM' },
    { name: 'Hardware Bitflags', sel: 'text=Hardware Flags' },
    { name: 'Debug Console', sel: 'text=Serial Debug Console' }
  ];

  for (const el of debugElements) {
    try {
      const loc = page.locator(el.sel).first();
      const count = await loc.count();
      if (count > 0) {
        const box = await loc.boundingBox();
        console.log(el.name, '=>', box ? `(${Math.round(box.x)}, ${Math.round(box.y)}, ${Math.round(box.width)}x${Math.round(box.height)})` : 'NO BOX');
      } else {
        console.log(el.name, '=> NOT FOUND (count=0)');
      }
    } catch (e) {
      console.log(el.name, '=> ERROR:', e.message);
    }
  }

  await browser.close();
})();
