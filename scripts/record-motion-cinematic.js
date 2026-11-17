const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function smoothMouseMove(page, startX, startY, endX, endY, durationMs = 450) {
  const steps = Math.max(12, Math.floor(durationMs / 16));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const curX = startX + (endX - startX) * ease;
    const curY = startY + (endY - startY) * ease;
    await page.mouse.move(curX, curY);
    await new Promise((r) => setTimeout(r, durationMs / steps));
  }
}

async function moveAndClick(page, curPos, selector, durationMs = 450) {
  try {
    const el = page.locator(selector).first();
    const count = await el.count().catch(() => 0);
    if (count === 0) {
      console.warn(`⚠️ Selector '${selector}' count=0, skipping.`);
      return curPos;
    }
    await el.waitFor({ state: 'visible', timeout: 3500 }).catch(() => null);
    const box = await el.boundingBox().catch(() => null);
    if (!box) {
      console.warn(`⚠️ Bounding box for '${selector}' null, skipping.`);
      return curPos;
    }

    const targetX = box.x + box.width / 2;
    const targetY = box.y + box.height / 2;

    await smoothMouseMove(page, curPos.x, curPos.y, targetX, targetY, durationMs);
    await page.waitForTimeout(80);
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(120);

    return { x: targetX, y: targetY };
  } catch (err) {
    console.warn(`⚠️ Error clicking '${selector}':`, err.message);
    return curPos;
  }
}

async function switchTab(page, index) {
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

(async () => {
  const outputDir = path.join(__dirname, '../raw_recordings');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎬 Launching High-Energy Cinematic Motion Recording Engine (Native 1080p 16:9)...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });

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

  // Setup Virtual Camera & Cyber-HUD Typewriter System
  await page.evaluate(() => {
    document.documentElement.style.backgroundColor = '#020617';
    document.body.style.backgroundColor = '#020617';
    document.body.style.overflow = 'hidden';

    const appRoot = document.querySelector('.min-h-screen');
    if (!appRoot) return;
    appRoot.id = 'cinematic-canvas';
    // Snappy high-energy camera motion curve
    appRoot.style.transition = 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)';
    appRoot.style.transformOrigin = '50% 50%';

    // Precise High-Velocity Cinematic Camera Controller
    window.setCamera = (targetX, targetY, zoom = 1, durationMs = 750) => {
      appRoot.style.transition = durationMs > 0 ? `transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1)` : 'none';
      const vpW = 1920;
      const vpH = 1080;
      const dx = (vpW / 2 - targetX) * (zoom > 1 ? 0.78 : 1);
      const dy = (vpH / 2 - targetY) * (zoom > 1 ? 0.78 : 1);
      appRoot.style.transform = `translate(${dx}px, ${dy}px) scale(${zoom})`;
    };

    // Cyber Pop-up Explainer HUD Modal with Real-Time Typewriter
    const hud = document.createElement('div');
    hud.id = 'cinematic-hud';
    hud.style.position = 'fixed';
    hud.style.bottom = '32px';
    hud.style.left = '50%';
    hud.style.transform = 'translateX(-50%)';
    hud.style.width = '1020px';
    hud.style.maxWidth = '94vw';
    hud.style.background = 'rgba(8, 14, 28, 0.94)';
    hud.style.backdropFilter = 'blur(20px)';
    hud.style.border = '1.5px solid rgba(56, 189, 248, 0.55)';
    hud.style.borderRadius = '14px';
    hud.style.padding = '18px 26px';
    hud.style.boxShadow = '0 16px 40px -4px rgba(0, 0, 0, 0.9), 0 0 32px rgba(56, 189, 248, 0.3)';
    hud.style.zIndex = '9999999';
    hud.style.fontFamily = 'monospace';
    hud.style.color = '#F8FAFC';
    hud.style.transition = 'opacity 0.35s ease-out, transform 0.35s ease-out';
    hud.style.pointerEvents = 'none';

    hud.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span id="hud-step-badge" style="background: rgba(34, 211, 238, 0.2); border: 1.5px solid #22D3EE; color: #22D3EE; font-size: 11px; font-weight: 900; padding: 2px 10px; border-radius: 6px; letter-spacing: 0.08em;">STEP 01 / 09</span>
          <span id="hud-arch-tag" style="color: #94A3B8; font-size: 11px; font-weight: 600; letter-spacing: 0.06em;">SIMULATION CONTROL</span>
        </div>
        <div id="hud-clock" style="color: #38BDF8; font-size: 11px; font-weight: bold; letter-spacing: 0.04em; display: flex; align-items: center; gap: 6px;">
          <span style="display: inline-block; width: 7px; height: 7px; background: #10B981; border-radius: 50%; box-shadow: 0 0 8px #10B981;"></span>
          100MHz PLL0 · ARMCC CO-SIM
        </div>
      </div>
      <div id="hud-title" style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px; font-family: sans-serif; letter-spacing: -0.01em;">
        Simulation Master Scheduler
      </div>
      <div id="hud-desc-wrap" style="font-size: 13.5px; color: #CBD5E1; line-height: 1.45; min-height: 40px; margin-bottom: 10px; font-family: sans-serif;">
        <span id="hud-desc"></span><span id="hud-cursor" style="display: inline-block; width: 8px; height: 15px; background: #22D3EE; margin-left: 3px; vertical-align: middle; animation: blink 0.7s infinite;"></span>
      </div>
      <div id="hud-specs" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
    `;

    // Add keyframe for cursor blink
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
    window.startTypewriter = (step, tag, title, fullText, badges = [], speedMs = 18) => {
      document.getElementById('hud-step-badge').innerText = step;
      document.getElementById('hud-arch-tag').innerText = tag;
      document.getElementById('hud-title').innerText = title;
      
      const specsContainer = document.getElementById('hud-specs');
      specsContainer.innerHTML = badges
        .map(
          (b) =>
            `<span style="font-size: 10px; font-weight: 600; background: rgba(15, 23, 42, 0.85); border: 1px solid #334155; padding: 2.5px 7px; border-radius: 4px; color: ${b.color || '#38BDF8'};">${b.text}</span>`
        )
        .join('');

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
    };

    // Virtual Glowing Cursor
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

  let curPos = { x: 300, y: 320 };
  await page.mouse.move(curPos.x, curPos.y);
  await page.waitForTimeout(400);

  // =========================================================================
  // STEP 01: SIMULATION CONTROL
  // =========================================================================
  console.log('📌 STEP 01: Simulation Control');
  await page.evaluate(() => {
    window.setCamera(260, 320, 1.85, 600);
    window.startTypewriter(
      'STEP 01 / 09',
      'SIMULATION CONTROL CORE',
      'Discrete Master Clock & SysTick Scheduler',
      'Generating periodic 1000ms interrupt ticks driving the ARM Cortex-M3 state machine. Supports real-time execution with Auto/Manual scheduler modes.',
      [
        { text: 'CLOCK: 1000ms TICK', color: '#10B981' },
        { text: 'CORE: LPC1768 CORTEX-M3', color: '#38BDF8' },
        { text: 'MODES: AUTO / MANUAL', color: '#F59E0B' },
        { text: 'STATUS: ACTIVE', color: '#A855F7' }
      ],
      14
    );
  });

  await page.waitForTimeout(400);
  console.log('▶️ Starting Simulation Clock...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Start')", 500);
  await page.waitForTimeout(600);

  console.log('⚡ Toggling Mode to Auto...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Auto')", 400);
  await page.waitForTimeout(2000);

  // =========================================================================
  // STEP 02: SMART GATE PLAZA (HIGHWAY TOLL PLAZA)
  // =========================================================================
  console.log('📌 STEP 02: Smart Gate Plaza (Dual-Lane Highway Toll Plaza)');
  await page.evaluate(() => {
    window.setCamera(960, 480, 1.75, 750);
    window.startTypewriter(
      'STEP 02 / 09',
      'SMART GATE PLAZA · DUAL-FLOW',
      'Optical IR Beam Sensing & 50Hz PWM Servo Actuation',
      'Vehicle trips Optical IR Beam (GPIO P0.4 Interrupt). ANPR OCR scans license plate in real time. PWM1.1 match register delivers a 2.0ms pulse to raise barrier arm 90° for highway clearance.',
      [
        { text: 'IR BEAM: GPIO P0.4 (INTERRUPT)', color: '#EF4444' },
        { text: 'PWM1.1: 50Hz SERVO 90°', color: '#10B981' },
        { text: 'ANPR: OCR RECOGNITION', color: '#38BDF8' },
        { text: 'INTERLOCK: OPTICAL SAFETY', color: '#F59E0B' }
      ],
      14
    );
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 880, 480, 500);
  curPos = { x: 880, y: 480 };
  await page.waitForTimeout(1400);

  // Trigger in-lane tap dispatch
  console.log('🚗 In-Lane Tap Car Dispatch...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Tap Car ($20)')", 450);
  await page.waitForTimeout(2600);

  // =========================================================================
  // STEP 03: OPERATOR DISPATCH CONSOLE
  // =========================================================================
  console.log('📌 STEP 03: Operator Dispatch Console');
  await page.evaluate(() => {
    window.setCamera(260, 480, 1.95, 700);
    window.startTypewriter(
      'STEP 03 / 09',
      'OPERATOR DISPATCH CONSOLE',
      'Manual Ingress Dispatch & Fleet Queuing',
      'Manual operator HMI interface dispatching tiered vehicles: Compact/Sedan ($20/hr, Bays 0-15), Motorcycle ($10/hr, Bays 16-25), and Heavy Commercial ($40/hr, Bays 26-31).',
      [
        { text: 'DISPATCH: CAR ($20/HR)', color: '#38BDF8' },
        { text: 'DISPATCH: BIKE ($10/HR)', color: '#34D399' },
        { text: 'DISPATCH: TRUCK ($40/HR)', color: '#F59E0B' },
        { text: 'QUEUE: ACTIVE ALLOCATOR', color: '#10B981' }
      ],
      14
    );
  });

  await page.waitForTimeout(300);
  console.log('🚗 Dispatching Car ($20)...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Car ($20)')", 450);
  await page.waitForTimeout(800);

  console.log('🏍️ Dispatching Bike ($10)...');
  curPos = await moveAndClick(page, curPos, "button:has-text('Bike ($10)')", 450);
  await page.waitForTimeout(2200);

  // =========================================================================
  // STEP 04: LPC1768 HARDWARE DIAGNOSTICS & REGISTERS
  // =========================================================================
  console.log('📌 STEP 04: LPC1768 Hardware Diagnostics');
  await page.evaluate(() => {
    window.setCamera(1620, 780, 1.95, 750);
    window.startTypewriter(
      'STEP 04 / 09',
      'LPC1768 HARDWARE DIAGNOSTICS',
      'ARM Cortex-M3 Registers & Bitpacked SRAM Struct',
      'Cycle-accurate register dump reflecting struct g_system mapped at SRAM 0x20000000. Monitors 100MHz PLL0 phase-locked loop, ADC photo-interrupter pins, and hardware fault status (ERR:0x00).',
      [
        { text: 'SRAM BASE: 0x20000000', color: '#F59E0B' },
        { text: 'PLL0 CLK: 100MHz', color: '#38BDF8' },
        { text: 'FLASH: 512KB · SRAM: 64KB', color: '#10B981' },
        { text: 'FAULT REGISTER: 0x00 OK', color: '#A855F7' }
      ],
      14
    );
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 1620, 780, 500);
  curPos = { x: 1620, y: 780 };
  await page.waitForTimeout(2800);

  // =========================================================================
  // STEP 05: REAL-TIME EVENT LOG STREAM
  // =========================================================================
  console.log('📌 STEP 05: Real-Time Event Log');
  await page.evaluate(() => {
    window.setCamera(1620, 340, 1.95, 700);
    window.startTypewriter(
      'STEP 05 / 09',
      'REAL-TIME EVENT STREAM',
      'Low-Latency Hardware Packet Telemetry',
      'Interrupt-driven circular buffer streaming real-time hardware telemetry packets: optical trip timestamps, PWM servo lift cycles, transit bay assignments, and gate closure events.',
      [
        { text: 'INTERRUPT: CIRCULAR BUFFER', color: '#38BDF8' },
        { text: 'PACKET: TIMESTAMPED FRAMES', color: '#10B981' },
        { text: 'BUS: AHB / APB 100MHz', color: '#F59E0B' }
      ],
      14
    );
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 1620, 340, 500);
  curPos = { x: 1620, y: 340 };
  await page.waitForTimeout(2800);

  // =========================================================================
  // STEP 06: VEHICLE DISTRIBUTION
  // =========================================================================
  console.log('📌 STEP 06: Vehicle Distribution');
  await page.evaluate(() => {
    window.setCamera(1620, 520, 1.95, 650);
    window.startTypewriter(
      'STEP 06 / 09',
      'VEHICLE DISTRIBUTION BREAKDOWN',
      'Dynamic Fleet Allocation & Capacity Quotas',
      'Spatial classification balancer tracking real-time quota distribution: 16 Car Bays (0-15), 10 Bike Bays (16-25), and 6 Truck Bays (26-31). Optimizes ingress throughput across lot zones.',
      [
        { text: 'CARS: 16 CAPACITY', color: '#38BDF8' },
        { text: 'BIKES: 10 CAPACITY', color: '#34D399' },
        { text: 'TRUCKS: 6 CAPACITY', color: '#F59E0B' },
        { text: 'BALANCER: DYNAMIC LOAD', color: '#10B981' }
      ],
      14
    );
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 1620, 520, 450);
  curPos = { x: 1620, y: 520 };
  await page.waitForTimeout(2800);

  // =========================================================================
  // STEP 07: ANALYTICS & REVENUE LEDGER
  // =========================================================================
  console.log('📌 STEP 07: Analytics & Revenue Ledger');
  await page.evaluate(() => {
    window.setCamera(1620, 640, 1.95, 650);
    window.startTypewriter(
      'STEP 07 / 09',
      'SYSTEM ANALYTICS & REVENUE',
      'Duration-Based Tariff Engine & Financial Ledger',
      'Automated rate calculation matrix processing duration-based billing. Tracks aggregate revenue accrual, average dwell duration per vehicle, and total exit turnover metrics.',
      [
        { text: 'RATE MATRIX: $10 - $40 / HR', color: '#F59E0B' },
        { text: 'SETTLEMENT: DURATION-BASED', color: '#10B981' },
        { text: 'FINANCIAL LEDGER: REAL-TIME', color: '#38BDF8' }
      ],
      14
    );
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 1620, 640, 450);
  curPos = { x: 1620, y: 640 };
  await page.waitForTimeout(2800);

  // =========================================================================
  // STEP 08: MAIN PARKING LOT (32 SLOTS)
  // =========================================================================
  console.log('📌 STEP 08: Main Parking Lot (32 Slots Grid)');
  await page.evaluate(() => {
    window.setCamera(960, 930, 1.75, 750);
    window.startTypewriter(
      'STEP 08 / 09',
      'PARKING LOT · 32-SLOT GRID',
      'Spatial Bay Matrix & Live Hardware Telemetry HUD',
      'Real-time 32-bay parking matrix with bitmapped occupancy states. Clicking Slot #0 engages the hardware bay inspector with ultrasonic proximity and optical interrupter telemetry.',
      [
        { text: 'CAPACITY: 32 DUAL-ZONE BAYS', color: '#38BDF8' },
        { text: 'INSPECTOR: BAY TELEMETRY HUD', color: '#A855F7' },
        { text: 'SORT ENGINE: O(n²) BUBBLE SORT', color: '#10B981' }
      ],
      14
    );
  });

  await page.waitForTimeout(400);
  console.log('🔍 Clicking Slot #0 to inspect bay...');
  curPos = await moveAndClick(page, curPos, 'button[title*="Slot #0"]', 550);
  await page.waitForTimeout(1400);

  // Pan quickly to Bay Telemetry HUD on left
  console.log('🔍 Inspecting Bay Hardware Telemetry HUD on left column...');
  await page.evaluate(() => {
    window.setCamera(260, 740, 1.95, 650);
  });
  await smoothMouseMove(page, curPos.x, curPos.y, 260, 740, 500);
  curPos = { x: 260, y: 740 };
  await page.waitForTimeout(2200);

  // Trigger Outbound Exit clearance
  console.log('💳 Outbound Exit Clearance (Pay & Exit)...');
  await page.evaluate(() => {
    window.setCamera(960, 660, 1.65, 600);
  });
  curPos = await moveAndClick(page, curPos, "button:has-text('Pay & Exit')", 500);
  await page.waitForTimeout(2200);

  // =========================================================================
  // STEP 09: DEBUG TAB & 14-STATE FSM STATE MACHINE
  // =========================================================================
  console.log('📌 STEP 09: Debug Tab & 14-State FSM State Machine');
  // First pan camera to center
  await page.evaluate(() => {
    window.setCamera(960, 540, 1.0, 500);
  });
  await page.waitForTimeout(400);

  // Switch to Debug Tab via robust synthetic dispatch
  console.log('🔍 Switching to Debug Tab...');
  await switchTab(page, 1);
  await page.waitForTimeout(700);

  // Smooth cinematic push-in directly onto the 14-State FSM Graph and Bitflags
  await page.evaluate(() => {
    window.setCamera(420, 500, 1.5, 750);
    window.startTypewriter(
      'STEP 09 / 09',
      'DEBUG TAB · DETERMINISTIC FSM',
      '14-State Finite State Machine & Hardware Bitflags',
      'LPC1768 microcontroller firmware implementing 14 deterministic states (IDLE, PROCESS_ENTRY, CALC_FEE, UPDATE_SLOT, etc.). Bitpacked 16-bit register flags guarantee atomic transitions with zero race conditions.',
      [
        { text: 'FSM: 14 ATOMIC STATES', color: '#38BDF8' },
        { text: 'FLAGS: 16-BIT REGISTER', color: '#F59E0B' },
        { text: 'ATOMIC MUTEX: REENTRANT', color: '#10B981' },
        { text: 'DEBUG CONSOLE: 115200 UART', color: '#A855F7' }
      ],
      14
    );
  });

  // Pan across State Machine and Hardware Flags
  await smoothMouseMove(page, curPos.x, curPos.y, 420, 500, 600);
  curPos = { x: 420, y: 500 };
  await page.waitForTimeout(3000);

  // Pan to System Flags & Debug Console
  await page.evaluate(() => {
    window.setCamera(1050, 500, 1.45, 750);
  });
  await smoothMouseMove(page, curPos.x, curPos.y, 1050, 500, 600);
  curPos = { x: 1050, y: 500 };
  await page.waitForTimeout(3200);

  // =========================================================================
  // STEP 10: GRAND FINALE — FULL WIDESCREEN PANORAMIC SHOWCASE
  // =========================================================================
  console.log('🌟 STEP 10: Grand Finale — Full Widescreen Panoramic Showcase');
  // Switch back to Simulation Tab
  console.log('🔍 Returning to Simulation Tab...');
  await switchTab(page, 0);
  await page.waitForTimeout(600);

  await page.evaluate(() => {
    window.startTypewriter(
      'FULL SHOWCASE',
      'PARKCORE v2.0 · MASTER DIGITAL TWIN',
      'Synchronized Full-Screen Autonomous Infrastructure',
      'All subsystems operating concurrently: two-way highway toll plaza, dual PWM servo boom gates, 32-bay telemetry grid, 14-state FSM core, and 60 FPS live digital twin execution.',
      [
        { text: 'STATUS: CONCURRENT 2-WAY FLOW', color: '#10B981' },
        { text: 'ALL SUBSYSTEMS SYNCHRONIZED', color: '#38BDF8' },
        { text: 'HARDWARE CO-SIMULATION ACTIVE', color: '#F59E0B' }
      ],
      12
    );

    // Explosive smooth, cinematic pull-out to 1.0x wide screen edge to edge
    window.setCamera(960, 540, 1.0, 1100);
  });

  await smoothMouseMove(page, curPos.x, curPos.y, 960, 540, 700);
  curPos = { x: 960, y: 540 };
  await page.waitForTimeout(3800);

  // Fade out HUD cleanly for the pristine wide-screen hero shot
  console.log('🌟 Fading HUD for clean edge-to-edge widescreen showcase...');
  await page.evaluate(() => {
    const hud = document.getElementById('cinematic-hud');
    if (hud) {
      hud.style.opacity = '0';
      hud.style.transform = 'translateX(-50%) translateY(40px)';
    }
  });
  await page.waitForTimeout(3500);

  console.log('🏁 Closing recording session...');
  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const rawVideoPath = await video.path();
    console.log('✅ High-Energy Cinematic Demo raw recording saved at:', rawVideoPath);
    fs.writeFileSync(path.join(outputDir, 'cinematic_motion_latest.txt'), rawVideoPath);
  }
})();
