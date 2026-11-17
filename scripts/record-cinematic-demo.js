const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function smoothMouseMove(page, startX, startY, endX, endY, durationMs = 700) {
  const steps = Math.max(20, Math.floor(durationMs / 16));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    // Cubic easeInOut
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const curX = startX + (endX - startX) * ease;
    const curY = startY + (endY - startY) * ease;
    await page.mouse.move(curX, curY);
    await new Promise((r) => setTimeout(r, durationMs / steps));
  }
}

async function moveAndClick(page, curPos, selector, durationMs = 700) {
  const el = await page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout: 7000 });
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const box = await el.boundingBox();
  if (!box) return curPos;

  const targetX = box.x + box.width / 2;
  const targetY = box.y + box.height / 2;

  await smoothMouseMove(page, curPos.x, curPos.y, targetX, targetY, durationMs);
  await page.waitForTimeout(150);
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.up();
  await page.waitForTimeout(250);

  return { x: targetX, y: targetY };
}

(async () => {
  const outputDir = path.join(__dirname, '../raw_recordings');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎬 Initializing Cinematic 4K Recording Engine...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });

  // 1440x900 viewport with deviceScaleFactor: 2 produces crystal sharp 2880x1800 UHD frames
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: outputDir,
      size: { width: 2880, height: 1800 },
    },
  });

  const page = await context.newPage();
  console.log('🌐 Loading ParkCore Dashboard at http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Inject sleek glowing cursor helper
  await page.evaluate(() => {
    const cursor = document.createElement('div');
    cursor.id = 'cinematic-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '24px';
    cursor.style.height = '24px';
    cursor.style.border = '2.5px solid #22d3ee';
    cursor.style.backgroundColor = 'rgba(6, 182, 212, 0.45)';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '999999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.12s, height 0.12s, background-color 0.12s, border-color 0.12s';
    cursor.style.boxShadow = '0 0 16px rgba(6, 182, 212, 0.85)';
    document.body.appendChild(cursor);

    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    window.addEventListener('mousedown', () => {
      cursor.style.width = '32px';
      cursor.style.height = '32px';
      cursor.style.backgroundColor = 'rgba(239, 68, 68, 0.75)';
      cursor.style.borderColor = '#f87171';
      cursor.style.boxShadow = '0 0 22px rgba(239, 68, 68, 0.95)';
    });
    window.addEventListener('mouseup', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.backgroundColor = 'rgba(6, 182, 212, 0.45)';
      cursor.style.borderColor = '#22d3ee';
      cursor.style.boxShadow = '0 0 16px rgba(6, 182, 212, 0.85)';
    });
  });

  let curPos = { x: 720, y: 150 };
  await page.mouse.move(curPos.x, curPos.y);
  await page.waitForTimeout(1000);

  // =========================================================================
  // SCENE 1: Brand Introduction & Header Architecture (0s - 12s)
  // =========================================================================
  console.log('📌 Scene 1: Header Exploration (Microchip 3D & LPC1768 Badges)');
  // Focus on ParkCore 3D Microchip Logo & Title
  await smoothMouseMove(page, curPos.x, curPos.y, 110, 48, 1000);
  curPos = { x: 110, y: 48 };
  await page.waitForTimeout(1600);

  // Focus on Embedded Architecture Badges (ARM Cortex-M3 / Keil RTX)
  await smoothMouseMove(page, curPos.x, curPos.y, 880, 48, 900);
  curPos = { x: 880, y: 48 };
  await page.waitForTimeout(1600);

  // =========================================================================
  // SCENE 2: Top KPI Ribbon Telemetry (12s - 25s)
  // =========================================================================
  console.log('📌 Scene 2: Top KPI Ribbon Exploration (Occupancy, Revenue, Utilization, Gate Traffic, LPC Core)');
  // Card 1: Occupancy 3D Plaque
  await smoothMouseMove(page, curPos.x, curPos.y, 140, 155, 800);
  curPos = { x: 140, y: 155 };
  await page.waitForTimeout(1200);

  // Card 2: Revenue Lottie Animated Coins
  await smoothMouseMove(page, curPos.x, curPos.y, 420, 155, 700);
  curPos = { x: 420, y: 155 };
  await page.waitForTimeout(1200);

  // Card 3: Utilization Circular Loader
  await smoothMouseMove(page, curPos.x, curPos.y, 710, 155, 700);
  curPos = { x: 710, y: 155 };
  await page.waitForTimeout(1200);

  // Card 4: Gate Plaza Traffic Light
  await smoothMouseMove(page, curPos.x, curPos.y, 1000, 155, 700);
  curPos = { x: 1000, y: 155 };
  await page.waitForTimeout(1200);

  // Card 5: ARM Cortex-M3 Core AI Processor
  await smoothMouseMove(page, curPos.x, curPos.y, 1280, 155, 700);
  curPos = { x: 1280, y: 155 };
  await page.waitForTimeout(1400);

  // =========================================================================
  // SCENE 3: Simulation Activation & Inbound Fleet Dispatch (25s - 55s)
  // =========================================================================
  console.log('📌 Scene 3: Simulation Activation & Lane 1 Inbound Fleet Dispatch');
  // Click Start Button
  curPos = await moveAndClick(page, curPos, "button:has-text('Start')", 900);
  await page.waitForTimeout(1200);

  // 1. Dispatch Car ($20)
  console.log('🚗 Dispatching Car ($20) into Lane 1...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Car ($20)')", 700);
  // Hover over Lane 1 boom gate area to watch 90° raise and vehicle transit
  await smoothMouseMove(page, curPos.x, curPos.y, 640, 380, 800);
  curPos = { x: 640, y: 380 };
  await page.waitForTimeout(2800);

  // 2. Dispatch Bike ($10)
  console.log('🏍️ Dispatching Bike ($10) into Lane 1...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Bike ($10)')", 700);
  await smoothMouseMove(page, curPos.x, curPos.y, 640, 380, 600);
  curPos = { x: 640, y: 380 };
  await page.waitForTimeout(2800);

  // 3. Dispatch Truck ($40) via In-Lane Tap Truck Button!
  console.log('🚚 Dispatching Truck ($40) via Lane Toll Plaza Button...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Tap Truck ($40)')", 700);
  await smoothMouseMove(page, curPos.x, curPos.y, 640, 380, 600);
  curPos = { x: 640, y: 380 };
  await page.waitForTimeout(2800);

  // =========================================================================
  // SCENE 4: Parking Bay Grid & Bay Telemetry HUD (55s - 72s)
  // =========================================================================
  console.log('📌 Scene 4: Parking Bay Grid & Telemetry HUD Inspection');
  // Scroll down smoothly to reveal Parking Lot grid
  await page.evaluate(() => window.scrollBy({ top: 220, behavior: 'smooth' }));
  await page.waitForTimeout(800);

  // Click on Slot #0 (Occupied Car) to inspect Bay Telemetry HUD
  console.log('🔍 Inspecting Slot #0 Bay Telemetry HUD...');
  curPos = await moveAndClick(page, curPos, 'button[title*="Slot #0"]', 800);
  await page.waitForTimeout(2800);

  // Click on Slot #1 (Occupied Bike)
  console.log('🔍 Inspecting Slot #16 (Bike) or Slot #1...');
  curPos = await moveAndClick(page, curPos, 'button[title*="Slot #16"], button[title*="Slot #1"]', 800);
  await page.waitForTimeout(2200);

  // Scroll back up to plaza view
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(800);

  // =========================================================================
  // SCENE 5: Outbound Clearance, ANPR Checkout & Revenue Accounting (72s - 92s)
  // =========================================================================
  console.log('📌 Scene 5: Outbound Exit Clearance (Lane 2 Exit Gate B & Revenue Accounting)');
  // Click Pay & Exit button in Lane 2
  curPos = await moveAndClick(page, curPos, "button:has-text('Pay & Exit')", 800);
  // Hover over Lane 2 Gate B to watch 90° raise, receipt popup, and vehicle highway merge
  await smoothMouseMove(page, curPos.x, curPos.y, 760, 560, 800);
  curPos = { x: 760, y: 560 };
  await page.waitForTimeout(3500);

  // Hover over updated Revenue & Cash Clear in KPI Ribbon
  await smoothMouseMove(page, curPos.x, curPos.y, 420, 155, 800);
  curPos = { x: 420, y: 155 };
  await page.waitForTimeout(1600);

  // =========================================================================
  // SCENE 6: Real-time Memory View & Bubble Sort Optimization (92s - 108s)
  // =========================================================================
  console.log('📌 Scene 6: Keil SRAM Memory View & Bubble Sort Algorithm');
  // Hover over Memory View (g_system) in right column
  await smoothMouseMove(page, curPos.x, curPos.y, 1260, 620, 800);
  curPos = { x: 1260, y: 620 };
  await page.waitForTimeout(1800);

  // Click Sort O(n²) button in Operator Dispatch Console
  console.log('⚡ Executing Bubble Sort (O(n²)) Algorithm...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Sort O(n²)')", 800);
  await page.waitForTimeout(2200);

  // Highlight Event Log showing sort swaps
  await smoothMouseMove(page, curPos.x, curPos.y, 1260, 310, 800);
  curPos = { x: 1260, y: 310 };
  await page.waitForTimeout(2000);

  // =========================================================================
  // SCENE 7: LPC1768 Debug State Machine & Register Traces (108s - 122s)
  // =========================================================================
  console.log('📌 Scene 7: Embedded LPC1768 FSM Diagram & Hardware Debug Tab');
  // Click Debug Tab
  curPos = await moveAndClick(page, curPos, "button[role='tab']:has-text('Debug')", 800);
  await page.waitForTimeout(2500);

  // Hover over 12-state FSM diagram
  await smoothMouseMove(page, curPos.x, curPos.y, 250, 340, 800);
  curPos = { x: 250, y: 340 };
  await page.waitForTimeout(1500);

  // Hover over Hardware Flags Panel
  await smoothMouseMove(page, curPos.x, curPos.y, 650, 340, 800);
  curPos = { x: 650, y: 340 };
  await page.waitForTimeout(1500);

  // Hover over Debug Console
  await smoothMouseMove(page, curPos.x, curPos.y, 1050, 340, 800);
  curPos = { x: 1050, y: 340 };
  await page.waitForTimeout(1500);

  // Return to Simulation Tab
  console.log('📌 Returning to Main Cockpit...');
  curPos = await moveAndClick(page, curPos, "button[role='tab']:has-text('Simulation')", 800);
  await page.waitForTimeout(1500);

  // =========================================================================
  // SCENE 8: Panoramic Master Shot & Grand Finale (122s - 132s)
  // =========================================================================
  console.log('📌 Scene 8: Master Overview & Final Grand Shot');
  await smoothMouseMove(page, curPos.x, curPos.y, 720, 450, 1000);
  await page.waitForTimeout(3500);

  console.log('🏁 Closing recording session...');
  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const rawVideoPath = await video.path();
    console.log('✅ Raw recording completed! File saved at:', rawVideoPath);
    fs.writeFileSync(path.join(outputDir, 'latest_recording.txt'), rawVideoPath);
  }
})();
