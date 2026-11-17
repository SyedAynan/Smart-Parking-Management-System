const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function smoothMouseMove(page, startX, startY, endX, endY, durationMs = 400) {
  const steps = Math.max(12, Math.floor(durationMs / 16));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    // Ease-out cubic
    const ease = 1 - Math.pow(1 - t, 3);
    const x = startX + (endX - startX) * ease;
    const y = startY + (endY - startY) * ease;
    await page.mouse.move(x, y);
    await page.waitForTimeout(16);
  }
}

async function moveAndClick(page, curPos, selector, moveDuration = 380) {
  try {
    const el = page.locator(selector).first();
    const count = await el.count().catch(() => 0);
    if (count > 0) {
      await el.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
      const box = await el.boundingBox().catch(() => null);
      if (box) {
        const targetX = Math.round(box.x + box.width / 2);
        const targetY = Math.round(box.y + box.height / 2);
        await smoothMouseMove(page, curPos.x, curPos.y, targetX, targetY, moveDuration);
        await page.waitForTimeout(60);
        await page.mouse.down();
        await page.waitForTimeout(80);
        await page.mouse.up();
        await page.waitForTimeout(100);
        return { x: targetX, y: targetY };
      }
    }
  } catch (e) {
    console.log(`[moveAndClick warn] ${selector}:`, e.message);
  }
  return curPos;
}

async function switchTab(page, tabIndex) {
  await page.evaluate((idx) => {
    const tabs = Array.from(document.querySelectorAll('[role="tab"], button[role="tab"], button[value="debug"], button[value="simulation"]'));
    const target = (idx === 1) 
      ? (tabs.find(t => t.textContent.includes('Debug')) || document.querySelector('button[value="debug"]'))
      : (tabs.find(t => t.textContent.includes('Simulation')) || document.querySelector('button[value="simulation"]'));
    if (target) {
      target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
      target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
      target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
      target.click();
    }
  }, tabIndex);
}

(async () => {
  const rawDir = path.join(__dirname, '..', 'raw_recordings');
  if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

  console.log('?? Launching Chrome for Complete Unobscured Walkthrough (1920x1080 @ 60fps)...');
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-size=1920,1080',
      '--enable-gpu-rasterization',
      '--enable-zero-copy',
      '--disable-background-timer-throttling'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: rawDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  console.log('?? Loading ParkCore Dashboard at http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Setup Virtual Camera with Origin 0 0 & Smart Adaptive Screen-Freeing HUD
  await page.evaluate(() => {
    document.documentElement.style.backgroundColor = '#020617';
    document.body.style.backgroundColor = '#020617';
    document.body.style.overflow = 'hidden';

    const appRoot = document.querySelector('.min-h-screen');
    if (!appRoot) return;
    appRoot.id = 'cinematic-canvas';
    appRoot.style.transformOrigin = '0 0';
    appRoot.style.transition = 'transform 580ms cubic-bezier(0.16, 1, 0.3, 1)';

    // Camera Controller: Centers target (x, y) on viewport center (960, 540)
    window.setCamera = (targetX, targetY, zoom = 1, durationMs = 580) => {
      appRoot.style.transition = durationMs > 0 ? `transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1)` : 'none';
      const dx = 960 - zoom * targetX;
      const dy = 540 - zoom * targetY;
      appRoot.style.transform = `translate(${dx}px, ${dy}px) scale(${zoom})`;
    };

    // Compact Adaptive Cyber HUD Modal that positions adaptively to keep focused UI 100% FREE
    const hud = document.createElement('div');
    hud.id = 'cinematic-hud';
    hud.style.position = 'fixed';
    hud.style.width = '780px';
    hud.style.maxWidth = '88vw';
    hud.style.background = 'rgba(6, 12, 26, 0.93)';
    hud.style.backdropFilter = 'blur(16px)';
    hud.style.border = '1.5px solid rgba(56, 189, 248, 0.65)';
    hud.style.borderRadius = '12px';
    hud.style.padding = '14px 22px';
    hud.style.boxShadow = '0 14px 38px -4px rgba(0, 0, 0, 0.92), 0 0 30px rgba(56, 189, 248, 0.3)';
    hud.style.zIndex = '9999999';
    hud.style.fontFamily = 'monospace';
    hud.style.color = '#F8FAFC';
    hud.style.transition = 'opacity 0.35s ease-out, transform 0.35s ease-out, top 0.4s ease-out, bottom 0.4s ease-out, left 0.4s ease-out, right 0.4s ease-out';
    hud.style.pointerEvents = 'none';

    hud.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span id="hud-step-badge" style="background: rgba(34, 211, 238, 0.2); border: 1.5px solid #22D3EE; color: #22D3EE; font-size: 11px; font-weight: 900; padding: 2px 8px; border-radius: 5px; letter-spacing: 0.08em;">STEP 01 / 10</span>
          <span id="hud-arch-tag" style="color: #94A3B8; font-size: 11px; font-weight: 600; letter-spacing: 0.06em;">SIMULATION CONTROL</span>
        </div>
        <div id="hud-clock" style="color: #38BDF8; font-size: 11px; font-weight: bold; letter-spacing: 0.04em; display: flex; align-items: center; gap: 5px;">
          <span style="display: inline-block; width: 6px; height: 6px; background: #10B981; border-radius: 50%; box-shadow: 0 0 8px #10B981;"></span>
          100MHz PLL0 · ARMCC
        </div>
      </div>
      <div id="hud-title" style="font-size: 17px; font-weight: 800; color: #FFFFFF; margin-bottom: 5px; font-family: sans-serif; letter-spacing: -0.01em;">
        Simulation Master Scheduler
      </div>
      <div id="hud-desc-wrap" style="font-size: 12.5px; color: #CBD5E1; line-height: 1.45; min-height: 36px; margin-bottom: 8px; font-family: sans-serif;">
        <span id="hud-desc"></span><span id="hud-cursor" style="display: inline-block; width: 7px; height: 13px; background: #22D3EE; margin-left: 2px; vertical-align: middle; animation: blink 0.7s infinite;"></span>
      </div>
      <div id="hud-specs" style="display: flex; gap: 6px; flex-wrap: wrap;"></div>
    `;

    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `;
    document.head.appendChild(styleSheet);
    document.body.appendChild(hud);

    let typeInterval = null;
    window.showAdaptiveHud = (step, tag, title, fullText, badges = [], position = 'top-right', speedMs = 12) => {
      hud.style.opacity = '1';
      // Clear positions
      hud.style.top = '';
      hud.style.bottom = '';
      hud.style.left = '';
      hud.style.right = '';
      hud.style.transform = '';

      if (position === 'top') {
        hud.style.top = '28px';
        hud.style.left = '50%';
        hud.style.transform = 'translateX(-50%)';
      } else if (position === 'bottom') {
        hud.style.bottom = '28px';
        hud.style.left = '50%';
        hud.style.transform = 'translateX(-50%)';
      } else if (position === 'top-right') {
        hud.style.top = '36px';
        hud.style.right = '40px';
      } else if (position === 'top-left') {
        hud.style.top = '36px';
        hud.style.left = '40px';
      } else if (position === 'bottom-left') {
        hud.style.bottom = '36px';
        hud.style.left = '40px';
      }

      document.getElementById('hud-step-badge').innerText = step;
      document.getElementById('hud-arch-tag').innerText = tag;
      document.getElementById('hud-title').innerText = title;

      const descEl = document.getElementById('hud-desc');
      descEl.innerText = '';
      if (typeInterval) clearInterval(typeInterval);

      let idx = 0;
      typeInterval = setInterval(() => {
        if (idx < fullText.length) {
          descEl.innerText += fullText[idx];
          idx++;
        } else {
          clearInterval(typeInterval);
        }
      }, speedMs);

      const specsEl = document.getElementById('hud-specs');
      specsEl.innerHTML = '';
      badges.forEach(b => {
        const span = document.createElement('span');
        span.style.background = 'rgba(15, 23, 42, 0.85)';
        span.style.border = `1px solid ${b.color || '#38BDF8'}`;
        span.style.color = b.color || '#38BDF8';
        span.style.fontSize = '10px';
        span.style.fontWeight = 'bold';
        span.style.padding = '2px 7px';
        span.style.borderRadius = '4px';
        span.style.letterSpacing = '0.04em';
        span.innerText = b.text;
        specsEl.appendChild(span);
      });
    };

    window.hideHud = () => {
      hud.style.opacity = '0';
    };

    // Glowing Neon Cursor Dot
    const cursor = document.createElement('div');
    cursor.id = 'cinematic-cursor';
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

  let curPos = { x: 300, y: 300 };
  await page.mouse.move(curPos.x, curPos.y);
  await page.waitForTimeout(400);

  // =========================================================================
  // STEP 01: SIMULATION CONTROL (HUD on Top-Right -> Left Screen 100% Free)
  // =========================================================================
  console.log('?? STEP 01: Simulation Control');
  await page.evaluate(() => {
    window.setCamera(368, 352, 1.85, 550);
    window.showAdaptiveHud(
      'STEP 01 / 10',
      'SIMULATION CONTROL CORE',
      'Discrete Master Clock & SysTick Scheduler',
      'Dispatches 1000ms periodic interrupt ticks driving the ARM Cortex-M3 state machine. Supports real-time execution with Auto/Manual modes.',
      [
        { text: 'CLOCK: 1000ms TICK', color: '#10B981' },
        { text: 'CORE: LPC1768 CORTEX-M3', color: '#38BDF8' },
        { text: 'MODES: AUTO / MANUAL', color: '#F59E0B' }
      ],
      'top-right',
      12
    );
  });

  await page.waitForTimeout(300);
  console.log('?? Starting Simulation Clock...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Start')", 450);
  await page.waitForTimeout(400);

  console.log('? Toggling Mode to Auto...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Auto')", 400);
  await page.waitForTimeout(2000);

  // =========================================================================
  // STEP 02: SMART GATE PLAZA (HUD at Bottom -> Highway Lanes 100% Free)
  // =========================================================================
  console.log('?? STEP 02: Smart Gate Plaza (Dual-Lane Highway Toll Plaza)');
  await page.evaluate(() => {
    window.setCamera(960, 560, 1.7, 580);
    window.showAdaptiveHud(
      'STEP 02 / 10',
      'SMART GATE PLAZA · DUAL-FLOW',
      'Optical IR Beam Sensing & 50Hz PWM Servo Actuation',
      'Vehicle trips Optical IR Beam (GPIO P0.4 Interrupt). ANPR OCR scans license plate in real time. PWM1.1 delivers a 2.0ms pulse raising barrier arm 90° for highway clearance.',
      [
        { text: 'IR BEAM: GPIO P0.4 (INTERRUPT)', color: '#EF4444' },
        { text: 'PWM1.1: 50Hz SERVO 90°', color: '#10B981' },
        { text: 'ANPR: OCR RECOGNITION', color: '#38BDF8' }
      ],
      'bottom',
      12
    );
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 880, 510, 450);
  curPos = { x: 880, y: 510 };
  await page.waitForTimeout(1200);

  console.log('?? In-Lane Tap Car Dispatch...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Tap Car ($20)')", 400);
  await page.waitForTimeout(3200);

  // =========================================================================
  // STEP 03: OPERATOR DISPATCH CONSOLE (HUD on Top-Right -> Console 100% Free)
  // =========================================================================
  console.log('?? STEP 03: Operator Dispatch Console');
  await page.evaluate(() => {
    window.setCamera(368, 546, 1.95, 580);
    window.showAdaptiveHud(
      'STEP 03 / 10',
      'OPERATOR DISPATCH CONSOLE',
      'Multi-Class Fleet Ingestion & Priority Dispatch',
      'Central control terminal to dispatch Cars ($20), Bikes ($10), and Commercial Trucks ($40). Integrates bubble sort engine for dynamic slot reallocation.',
      [
        { text: 'FLEET: CAR / BIKE / TRUCK', color: '#38BDF8' },
        { text: 'DISPATCH: MANUAL OVERRIDE', color: '#10B981' },
        { text: 'ALGORITHM: O(n²) BUBBLE SORT', color: '#F59E0B' }
      ],
      'top-right',
      12
    );
  });

  await page.waitForTimeout(300);
  console.log('?? Dispatching Car via Console...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Car ($20)')", 450);
  await page.waitForTimeout(1000);

  console.log('??? Dispatching Bike via Console...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Bike ($10)')", 400);
  await page.waitForTimeout(2000);

  // =========================================================================
  // STEP 04: MAIN PARKING LOT 32-SLOT GRID (HUD at Top -> 32 Slots 100% Free)
  // =========================================================================
  console.log('?? STEP 04: Main Parking Lot (32 Slots Grid & Slot State Transition)');
  await page.evaluate(() => {
    window.setCamera(960, 1303, 1.45, 600);
    window.showAdaptiveHud(
      'STEP 04 / 10',
      'MAIN PARKING LOT · 32 BAYS',
      'Spatial Bay Matrix & Live Hardware Telemetry HUD',
      '32 partitioned bays with bitmapped occupancy states: Cars (0-15), Bikes (16-25), Trucks (26-31). Watch slots light up upon vehicle arrival. Clicking Slot #0 engages bay telemetry.',
      [
        { text: 'CAPACITY: 32 DUAL-ZONE BAYS', color: '#38BDF8' },
        { text: 'INSPECTOR: BAY TELEMETRY HUD', color: '#A855F7' },
        { text: 'OCCUPANCY: BITMAPPED REGISTER', color: '#10B981' }
      ],
      'top',
      12
    );
  });

  await page.waitForTimeout(1200);
  console.log('?? Clicking Slot #0 to inspect bay hardware telemetry...');
  curPos = await moveAndClick(page, curPos, 'button[title*="Slot #0"]', 500);
  await page.waitForTimeout(1500);

  console.log('?? Clicking Slot #1 to inspect adjacent bay...');
  curPos = await moveAndClick(page, curPos, 'button[title*="Slot #1"]', 450);
  await page.waitForTimeout(2500);

  // =========================================================================
  // STEP 05: LPC1768 HARDWARE DIAGNOSTICS (HUD on Top-Right -> Diagnostics 100% Free)
  // =========================================================================
  console.log('?? STEP 05: LPC1768 Hardware Diagnostics');
  await page.evaluate(() => {
    window.setCamera(368, 766, 1.9, 580);
    window.showAdaptiveHud(
      'STEP 05 / 10',
      'HARDWARE DIAGNOSTICS · KEIL RTX',
      'ARM Cortex-M3 Clock, SysTick & Peripherals',
      'Displays 100MHz PLL0 master clock, SysTick 10ms hardware timer, GPIO Port 0/2 pin assignments, dual 50Hz PWM servos, and 115200 8-N-1 UART0 debug stream.',
      [
        { text: 'CORE: 100MHz PLL0', color: '#38BDF8' },
        { text: 'SYSTICK: 10ms INTERRUPT', color: '#10B981' },
        { text: 'GPIO: P0.4 / P2.0', color: '#EF4444' },
        { text: 'UART0: 115200 8-N-1', color: '#F59E0B' }
      ],
      'top-right',
      12
    );
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 368, 766, 450);
  curPos = { x: 368, y: 766 };
  await page.waitForTimeout(3200);

  // =========================================================================
  // STEP 06: EVENT LOG (HUD on Top-Left -> Event Log 100% Free)
  // =========================================================================
  console.log('?? STEP 06: Real-Time Event Log');
  await page.evaluate(() => {
    window.setCamera(1553, 332, 1.85, 580);
    window.showAdaptiveHud(
      'STEP 06 / 10',
      'EVENT LOG · REAL-TIME AUDIT',
      'Deterministic Audit Log & Timestamped Events',
      'Chronological rolling log of all vehicle arrivals, gate actuation triggers, slot assignments, and exit payment transactions with millisecond precision.',
      [
        { text: 'LOGGING: NON-BLOCKING RING BUFFER', color: '#38BDF8' },
        { text: 'ENTRIES: REAL-TIME AUDIT', color: '#10B981' }
      ],
      'top-left',
      12
    );
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 1553, 332, 450);
  curPos = { x: 1553, y: 332 };
  await page.waitForTimeout(3000);

  // =========================================================================
  // STEP 07: VEHICLE DISTRIBUTION (HUD on Top-Left -> Vehicle Dist 100% Free)
  // =========================================================================
  console.log('?? STEP 07: Vehicle Distribution');
  await page.evaluate(() => {
    window.setCamera(1553, 481, 1.9, 580);
    window.showAdaptiveHud(
      'STEP 07 / 10',
      'VEHICLE DISTRIBUTION METRICS',
      'Fleet Breakdown & Capacity Management',
      'Real-time visualization of active lot occupancy across Cars (max 16), Bikes (max 10), and Trucks (max 6) with dynamic capacity threshold monitoring.',
      [
        { text: 'CARS: 16 MAX ($20)', color: '#38BDF8' },
        { text: 'BIKES: 10 MAX ($10)', color: '#10B981' },
        { text: 'TRUCKS: 6 MAX ($40)', color: '#F59E0B' }
      ],
      'top-left',
      12
    );
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 1553, 481, 450);
  curPos = { x: 1553, y: 481 };
  await page.waitForTimeout(3000);

  // =========================================================================
  // STEP 08: ANALYTICS & FINANCIAL LEDGER (HUD on Top-Left -> Analytics 100% Free)
  // =========================================================================
  console.log('?? STEP 08: Analytics & Financial Ledger');
  await page.evaluate(() => {
    window.setCamera(1553, 680, 1.75, 580);
    window.showAdaptiveHud(
      'STEP 08 / 10',
      'ANALYTICS & FINANCIAL LEDGER',
      'Duration-Based Tariff Engine & Revenue Ledger',
      'Automated rate calculation matrix processing duration-based billing, total entries/exits, peak load tracking, and real-time SRAM memory mapping (g_system).',
      [
        { text: 'RATE MATRIX: $10 - $40 / HR', color: '#F59E0B' },
        { text: 'SETTLEMENT: DURATION-BASED', color: '#10B981' },
        { text: 'FINANCIAL LEDGER: REAL-TIME', color: '#38BDF8' }
      ],
      'top-left',
      12
    );
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 1553, 680, 450);
  curPos = { x: 1553, y: 680 };
  await page.waitForTimeout(3200);

  // Outbound Exit Clearance (Pay & Exit)
  console.log('?? Outbound Exit Clearance (Pay & Exit)...');
  await page.evaluate(() => {
    window.setCamera(960, 680, 1.65, 550);
  });
  curPos = await moveAndClick(page, curPos, "button:has-text('Pay & Exit')", 450);
  await page.waitForTimeout(2000);

  // =========================================================================
  // STEP 09: DEBUG TAB & 14-STATE FSM (HUD on Top-Right -> FSM 100% Free)
  // =========================================================================
  console.log('?? STEP 09: Debug Tab & 14-State FSM State Machine');
  // First pan camera to center
  await page.evaluate(() => {
    window.setCamera(960, 540, 1.0, 450);
  });
  await page.waitForTimeout(250);

  // Switch to Debug Tab
  console.log('?? Switching to Debug Tab...');
  await switchTab(page, 1);
  await page.waitForTimeout(600);

  // Cinematic push-in on 14-State FSM with HUD placed on Top-Right (FSM 100% unobstructed)
  await page.evaluate(() => {
    window.setCamera(540, 480, 1.4, 600);
    window.showAdaptiveHud(
      'STEP 09 / 10',
      'DEBUG TAB · DETERMINISTIC FSM',
      '14-State Finite State Machine & Hardware Bitflags',
      'LPC1768 microcontroller firmware implementing 14 deterministic states (IDLE, PROCESS_ENTRY, CALC_FEE, UPDATE_SLOT, etc.). Bitpacked 16-bit register flags guarantee atomic transitions with zero race conditions.',
      [
        { text: 'FSM: 14 ATOMIC STATES', color: '#38BDF8' },
        { text: 'FLAGS: 16-BIT REGISTER', color: '#F59E0B' },
        { text: 'MUTEX: REENTRANT-SAFE', color: '#10B981' },
        { text: 'UART0: 115200 SERIAL', color: '#A855F7' }
      ],
      'top-right',
      12
    );
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 540, 480, 450);
  curPos = { x: 540, y: 480 };
  await page.waitForTimeout(3500);

  // Pan to System Flags & Debug Console on the right
  await page.evaluate(() => {
    window.setCamera(1180, 480, 1.4, 580);
  });
  await smoothMouseMove(page, curPos.x, curPos.y, 1180, 480, 450);
  curPos = { x: 1180, y: 480 };
  await page.waitForTimeout(3000);

  // =========================================================================
  // STEP 10: GRAND FINALE — FULL WIDESCREEN PANORAMIC (100% Screen Free)
  // =========================================================================
  console.log('?? STEP 10: Grand Finale — Full Widescreen Panoramic Showcase');
  // Return to Simulation Tab
  console.log('?? Returning to Simulation Tab...');
  await switchTab(page, 0);
  await page.waitForTimeout(400);

  // Perfect 16:9 full-dashboard fit (docHeight = 1632, zoom = 0.65, center = (960, 816))
  await page.evaluate(() => {
    window.hideHud();
    window.setCamera(960, 816, 0.65, 750);
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 960, 540, 600);
  curPos = { x: 960, y: 540 };

  // Dispatch continuous traffic during wide showcase so the viewer sees full concurrency
  console.log('?? Live Autonomous Infrastructure Showcase...');
  await page.waitForTimeout(2000);

  curPos = await moveAndClick(page, curPos, "button:has-text('Tap Car ($20)')", 500);
  await page.waitForTimeout(2500);

  curPos = await moveAndClick(page, curPos, "button:has-text('Tap Bike ($10)')", 500);
  await page.waitForTimeout(2500);

  curPos = await moveAndClick(page, curPos, "button:has-text('Pay & Exit')", 500);
  await page.waitForTimeout(3500);

  console.log('?? Walkthrough recording complete! Closing page...');
  await page.close();
  await context.close();
  await browser.close();
  console.log('? Browser recording session finalized.');
})();
