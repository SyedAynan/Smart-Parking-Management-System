const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function smoothMouseMove(page, startX, startY, endX, endY, durationMs = 500) {
  const steps = Math.max(15, Math.floor(durationMs / 16));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const curX = startX + (endX - startX) * ease;
    const curY = startY + (endY - startY) * ease;
    await page.mouse.move(curX, curY);
    await new Promise((r) => setTimeout(r, durationMs / steps));
  }
}

async function moveAndClick(page, curPos, selector, durationMs = 500) {
  const el = await page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout: 7000 });
  const box = await el.boundingBox();
  if (!box) return curPos;

  const targetX = box.x + box.width / 2;
  const targetY = box.y + box.height / 2;

  await smoothMouseMove(page, curPos.x, curPos.y, targetX, targetY, durationMs);
  await page.waitForTimeout(100);
  await page.mouse.down();
  await page.waitForTimeout(100);
  await page.mouse.up();
  await page.waitForTimeout(150);

  return { x: targetX, y: targetY };
}

(async () => {
  const outputDir = path.join(__dirname, '../raw_recordings');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎬 Launching Byte Monk Style Cinematic Screen Recording Engine (Native 1080p 16:9)...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });

  // Viewport and video size matching 1920x1080 ensures 100% full-screen edge-to-edge frame
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();
  console.log('🌐 Loading ParkCore Dashboard at http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Setup Virtual Camera & Byte Monk Technical HUD System
  await page.evaluate(() => {
    document.documentElement.style.backgroundColor = '#020617';
    document.body.style.backgroundColor = '#020617';
    document.body.style.overflow = 'hidden';

    const appRoot = document.querySelector('.min-h-screen');
    if (!appRoot) return;
    appRoot.id = 'bytemonk-canvas';
    appRoot.style.transition = 'transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)';
    appRoot.style.transformOrigin = '50% 50%';

    // Precise Cinematic Camera Controller for 1920x1080 Viewport
    window.setCamera = (targetX, targetY, zoom = 1, durationMs = 1000) => {
      appRoot.style.transition = durationMs > 0 ? `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none';
      const vpW = 1920;
      const vpH = 1080;
      const dx = (vpW / 2 - targetX) * (zoom > 1 ? 0.75 : 1);
      const dy = (vpH / 2 - targetY) * (zoom > 1 ? 0.75 : 1);
      appRoot.style.transform = `translate(${dx}px, ${dy}px) scale(${zoom})`;
    };

    // Byte Monk Floating Technical HUD
    const hud = document.createElement('div');
    hud.id = 'bytemonk-hud';
    hud.style.position = 'fixed';
    hud.style.bottom = '28px';
    hud.style.left = '50%';
    hud.style.transform = 'translateX(-50%)';
    hud.style.width = '960px';
    hud.style.maxWidth = '92vw';
    hud.style.background = 'rgba(11, 17, 32, 0.92)';
    hud.style.backdropFilter = 'blur(16px)';
    hud.style.border = '1.5px solid rgba(56, 189, 248, 0.5)';
    hud.style.borderRadius = '14px';
    hud.style.padding = '16px 24px';
    hud.style.boxShadow = '0 12px 36px -4px rgba(0, 0, 0, 0.85), 0 0 28px rgba(56, 189, 248, 0.35)';
    hud.style.zIndex = '9999999';
    hud.style.fontFamily = 'monospace';
    hud.style.color = '#F8FAFC';
    hud.style.transition = 'all 0.4s ease-out';
    hud.style.pointerEvents = 'none';

    hud.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span id="hud-step-badge" style="background: rgba(34, 211, 238, 0.2); border: 1px solid #22D3EE; color: #22D3EE; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 6px; letter-spacing: 0.05em;">STEP 01 / 07</span>
          <span id="hud-arch-tag" style="color: #94A3B8; font-size: 11px; letter-spacing: 0.05em;">OPERATOR DISPATCH CONSOLE</span>
        </div>
        <div id="hud-clock" style="color: #38BDF8; font-size: 11px; font-weight: bold;">100MHz PLL0 · SysTick ACTIVE</div>
      </div>
      <div id="hud-title" style="font-size: 17px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px; font-family: sans-serif; letter-spacing: -0.01em;">
        Simulation Clock & Inbound Fleet Queuing
      </div>
      <div id="hud-desc" style="font-size: 13px; color: #CBD5E1; line-height: 1.4; margin-bottom: 8px; font-family: sans-serif;">
        Engaging 1000ms simulation scheduler and dispatching tiered fleet vehicles (Car $20/hr, Bike $10/hr, Truck $40/hr).
      </div>
      <div id="hud-specs" style="display: flex; gap: 8px; flex-wrap: wrap;">
        <span style="font-size: 10px; background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; padding: 2px 6px; border-radius: 4px; color: #10B981;">SIM CLOCK: 1000ms</span>
        <span style="font-size: 10px; background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; padding: 2px 6px; border-radius: 4px; color: #38BDF8;">CAR: $20/HR</span>
        <span style="font-size: 10px; background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; padding: 2px 6px; border-radius: 4px; color: #34D399;">BIKE: $10/HR</span>
        <span style="font-size: 10px; background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; padding: 2px 6px; border-radius: 4px; color: #F59E0B;">TRUCK: $40/HR</span>
      </div>
    `;

    document.body.appendChild(hud);

    window.updateHud = (step, tag, title, desc, badges = []) => {
      document.getElementById('hud-step-badge').innerText = step;
      document.getElementById('hud-arch-tag').innerText = tag;
      document.getElementById('hud-title').innerText = title;
      document.getElementById('hud-desc').innerText = desc;
      const specsContainer = document.getElementById('hud-specs');
      specsContainer.innerHTML = badges
        .map(
          (b) =>
            `<span style="font-size: 10px; background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; padding: 2px 6px; border-radius: 4px; color: ${b.color || '#38BDF8'};">${b.text}</span>`
        )
        .join('');
    };

    // Set initial camera focus directly on Operator Console (skip any header/KPI hover)
    window.setCamera(360, 420, 1.35, 0);

    // Virtual Glowing Cursor
    const cursor = document.createElement('div');
    cursor.id = 'bytemonk-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '24px';
    cursor.style.height = '24px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'rgba(6, 182, 212, 0.45)';
    cursor.style.border = '2px solid #22d3ee';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '99999999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.12s, height 0.12s, background-color 0.12s, border-color 0.12s';
    cursor.style.boxShadow = '0 0 18px rgba(6, 182, 212, 0.85)';
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
      cursor.style.boxShadow = '0 0 24px rgba(239, 68, 68, 0.95)';
    });
    window.addEventListener('mouseup', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.backgroundColor = 'rgba(6, 182, 212, 0.45)';
      cursor.style.borderColor = '#22d3ee';
      cursor.style.boxShadow = '0 0 18px rgba(6, 182, 212, 0.85)';
    });
  });

  let curPos = { x: 360, y: 350 };
  await page.mouse.move(curPos.x, curPos.y);
  await page.waitForTimeout(500);

  // =========================================================================
  // STEP 1: Operator Dispatch Console & Clock Engagement
  // (Starts directly with simulation controls; skips all header and KPI hovers)
  // =========================================================================
  console.log('📌 STEP 1: Operator Dispatch Console & Clock Engagement');
  await page.evaluate(() => {
    window.updateHud(
      'STEP 01 / 07',
      'OPERATOR DISPATCH CONSOLE',
      'Simulation Clock & Inbound Fleet Queuing',
      'Engaging 1000ms simulation scheduler and dispatching tiered fleet vehicles (Car $20/hr, Bike $10/hr, Truck $40/hr).',
      [
        { text: 'SIM CLOCK: 1000ms', color: '#10B981' },
        { text: 'CAR: $20/HR', color: '#38BDF8' },
        { text: 'BIKE: $10/HR', color: '#34D399' },
        { text: 'TRUCK: $40/HR', color: '#F59E0B' }
      ]
    );
    window.setCamera(360, 420, 1.35, 1000);
  });
  await page.waitForTimeout(400);

  // Click Start Button
  console.log('▶️ Engaging Simulation Clock (Start)...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Start')", 600);
  await page.waitForTimeout(800);

  // Dispatch Car
  console.log('🚗 Dispatching Car ($20)...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Car ($20)')", 500);
  await page.waitForTimeout(1800);

  // =========================================================================
  // STEP 2: Smart Toll Plaza & 90° Boom Barrier Actuation
  // =========================================================================
  console.log('📌 STEP 2: Smart Toll Plaza & 90° Boom Barrier Actuation');
  await page.evaluate(() => {
    window.updateHud(
      'STEP 02 / 07',
      'HIGHWAY TOLL PLAZA · ACTUATION',
      'Optical IR Beam Sensing & 50Hz PWM Servo Gate',
      'Vehicle trips IR Beam P0.4 → ANPR OCR scans license plate → PWM1.1 pulses 2.0ms raising barrier arm 90° → Vehicle rolls onto asphalt highway into lot.',
      [
        { text: 'GPIO: P0.4 (IR INTERRUPT)', color: '#EF4444' },
        { text: 'PWM1.1: 2.0ms (SERVO 90°)', color: '#10B981' },
        { text: 'ANPR: OCR SCAN REVEALED', color: '#38BDF8' },
        { text: 'ASPHALT: THERMOPLASTIC MARKINGS', color: '#F59E0B' }
      ]
    );
    window.setCamera(960, 520, 1.35, 1000);
  });

  // Watch vehicle transit, gate raise 90°, gate close
  await smoothMouseMove(page, curPos.x, curPos.y, 880, 520, 600);
  curPos = { x: 880, y: 520 };
  await page.waitForTimeout(2800);

  // Dispatch Bike via In-Lane Button
  console.log('🏍️ Dispatching Bike ($10) via In-Lane Button...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Tap Bike ($10)')", 500);
  await smoothMouseMove(page, curPos.x, curPos.y, 880, 520, 500);
  curPos = { x: 880, y: 520 };
  await page.waitForTimeout(2600);

  // =========================================================================
  // STEP 3: 32-Bay Parking Lot Grid & Bay Telemetry HUD
  // =========================================================================
  console.log('📌 STEP 3: 32-Bay Parking Lot Grid & Bay Telemetry HUD');
  await page.evaluate(() => {
    window.updateHud(
      'STEP 03 / 07',
      '32-BAY PARKING MATRIX',
      'Real-Time Bay Telemetry & Vehicle Tracking',
      'Grid allocates parking slots into Cars (0-15), Bikes (16-25), and Trucks (26-31). Selecting Slot #0 opens the live hardware telemetry HUD.',
      [
        { text: 'CARS: 0-15 ($20)', color: '#38BDF8' },
        { text: 'BIKES: 16-25 ($10)', color: '#34D399' },
        { text: 'TRUCKS: 26-31 ($40)', color: '#F59E0B' },
        { text: 'INSPECTOR: ACTIVE BAY HUD', color: '#A855F7' }
      ]
    );
    window.setCamera(960, 950, 1.3, 1000);
  });

  // Click on Slot #0
  console.log('🔍 Inspecting Slot #0...');
  await page.waitForTimeout(400);
  curPos = await moveAndClick(page, curPos, 'button[title*="Slot #0"]', 600);
  await page.waitForTimeout(1200);

  // Pan to Left Column Bay Telemetry HUD
  await page.evaluate(() => {
    window.updateHud(
      'STEP 03 / 07',
      'BAY TELEMETRY HUD INSPECTOR',
      'Live Sensor Flags & Tariff Accrual',
      'Occupancy duration, accrued fee calculation, and real-time sensor diagnostics for active vehicle bay.',
      [
        { text: 'STATUS: OCCUPIED', color: '#10B981' },
        { text: 'TARIFF: $20.00/HR', color: '#F59E0B' },
        { text: 'SENSOR: OPTICAL TRIP', color: '#38BDF8' }
      ]
    );
    window.setCamera(360, 720, 1.35, 1000);
  });
  await smoothMouseMove(page, curPos.x, curPos.y, 220, 720, 600);
  curPos = { x: 220, y: 720 };
  await page.waitForTimeout(2600);

  // =========================================================================
  // STEP 4: Outbound Exit Clearance & Automatic Fare Settlement
  // =========================================================================
  console.log('📌 STEP 4: Outbound Exit Clearance & Automatic Fare Settlement');
  await page.evaluate(() => {
    window.updateHud(
      'STEP 04 / 07',
      'HIGHWAY TOLL PLAZA · OUTBOUND LANE B',
      'Fare Settlement & Outbound Servo Actuation',
      'Vehicle exits bay → Arrives at Outbound Gate B → Tariff settled automatically → PWM1.2 raises barrier 90° for city highway egress.',
      [
        { text: 'FARE: RECEIPT GENERATED', color: '#10B981' },
        { text: 'PWM1.2: 2.0ms (EXIT GATE)', color: '#A855F7' },
        { text: 'EGRESS: OPPOSITE FLOW', color: '#38BDF8' }
      ]
    );
    window.setCamera(960, 680, 1.35, 1000);
  });
  await page.waitForTimeout(400);

  // Click Pay & Exit in Lane B
  console.log('💳 Triggering Outbound Pay & Exit...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Pay & Exit')", 500);
  await smoothMouseMove(page, curPos.x, curPos.y, 960, 680, 500);
  curPos = { x: 960, y: 680 };
  await page.waitForTimeout(3000);

  // =========================================================================
  // STEP 5: In-Memory Bubble Sort & Real-Time Memory Map
  // =========================================================================
  console.log('📌 STEP 5: In-Memory Bubble Sort & Low-Level SRAM Struct Mapping');
  await page.evaluate(() => {
    window.updateHud(
      'STEP 05 / 07',
      'SRAM MEMORY ENGINE · 0x20000000',
      'Low-Level Struct Mapping & In-Memory Bubble Sort',
      'Hexadecimal view of struct g_system mapped at 0x20000000. Executing O(n²) Bubble Sort restructures parking bays in place by duration and occupancy.',
      [
        { text: 'STRUCT: g_system', color: '#38BDF8' },
        { text: 'ADDR: 0x20000000', color: '#F59E0B' },
        { text: 'FLAGS: 0x20000400', color: '#10B981' },
        { text: 'ALGO: BUBBLE SORT O(n²)', color: '#A855F7' }
      ]
    );
    window.setCamera(1560, 760, 1.35, 1000);
  });
  await smoothMouseMove(page, curPos.x, curPos.y, 1620, 760, 600);
  curPos = { x: 1620, y: 760 };
  await page.waitForTimeout(2000);

  // Pan to Operator Console to click Sort
  await page.evaluate(() => {
    window.setCamera(360, 480, 1.35, 800);
  });
  curPos = await moveAndClick(page, curPos, "button:has-text('Sort O(n²)')", 600);
  await page.waitForTimeout(800);

  // Zoom back to Event log
  await page.evaluate(() => {
    window.setCamera(1560, 420, 1.35, 800);
  });
  await smoothMouseMove(page, curPos.x, curPos.y, 1620, 420, 600);
  curPos = { x: 1620, y: 420 };
  await page.waitForTimeout(2400);

  // =========================================================================
  // STEP 6: LPC1768 Cortex-M3 FSM Debugger & Register Traces
  // =========================================================================
  console.log('📌 STEP 6: Embedded Hardware Debug State Machine & Register Traces');
  await page.evaluate(() => {
    window.setCamera(960, 120, 1.25, 800);
  });
  curPos = await moveAndClick(page, curPos, "button[role='tab']:has-text('Debug')", 600);
  await page.waitForTimeout(400);

  await page.evaluate(() => {
    window.updateHud(
      'STEP 06 / 07',
      'HARDWARE DEBUG TAB · CORTEX-M3',
      '12-State Finite State Machine & UART0 Serial Trace',
      'Interactive FSM node graph highlights state transitions in real time alongside 16-bit GPIO interrupt registers and 115200 baud UART0 serial logs.',
      [
        { text: 'FSM: 12 DETERMINISTIC STATES', color: '#38BDF8' },
        { text: 'GPIO FLAGS: 16-BIT REGISTER', color: '#F59E0B' },
        { text: 'UART0: 115200 8-N-1', color: '#10B981' }
      ]
    );
    window.setCamera(960, 520, 1.25, 1000);
  });
  await smoothMouseMove(page, curPos.x, curPos.y, 960, 520, 600);
  curPos = { x: 960, y: 520 };
  await page.waitForTimeout(3200);

  // Return to Simulation Tab
  console.log('📌 Returning to Simulation Cockpit for Full Wide Screen Finale...');
  curPos = await moveAndClick(page, curPos, "button[role='tab']:has-text('Simulation')", 600);
  await page.waitForTimeout(600);

  // =========================================================================
  // STEP 7: GRAND FINALE — FULL WIDE SCREEN MASTER SHOWCASE
  // =========================================================================
  console.log('🌟 STEP 7: GRAND FINALE — FULL WIDE SCREEN MASTER SHOWCASE');
  await page.evaluate(() => {
    window.updateHud(
      'FULL SHOWCASE',
      'PARKCORE v2.0 · AUTONOMOUS SMART INFRASTRUCTURE',
      'Full Synchronized Wide-Screen Cockpit Overview',
      'All subsystems operating concurrently: two-way highway toll plaza, dual PWM servo boom gates, 32-bay telemetry grid, real-time memory view, and 60 FPS live metrics.',
      [
        { text: 'STATUS: CONCURRENT 2-WAY FLOW', color: '#10B981' },
        { text: 'ALL SYSTEMS OPERATIONAL', color: '#38BDF8' },
        { text: 'EMBEDDED DIGITAL TWIN READY', color: '#A855F7' }
      ]
    );
    // Smooth, cinematic pull-back to 1.0x wide screen edge to edge
    window.setCamera(960, 540, 1.0, 1200);
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 960, 540, 800);
  curPos = { x: 960, y: 540 };
  await page.waitForTimeout(3500);

  // Hide HUD for the final pristine wide screen shot
  await page.evaluate(() => {
    const hud = document.getElementById('bytemonk-hud');
    if (hud) {
      hud.style.opacity = '0';
      hud.style.transform = 'translateX(-50%) translateY(40px)';
    }
  });
  await page.waitForTimeout(3000);

  console.log('🏁 Closing recording session...');
  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const rawVideoPath = await video.path();
    console.log('✅ Byte Monk Demo raw recording saved at:', rawVideoPath);
    fs.writeFileSync(path.join(outputDir, 'bytemonk_latest_recording.txt'), rawVideoPath);
  }
})();
