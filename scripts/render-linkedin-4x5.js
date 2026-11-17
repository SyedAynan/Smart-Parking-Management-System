const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG_PATH = "C:\\Users\\syeds\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe";
const in4K = "S:\\ParkCore_Cinematic_Complete_Walkthrough_4K.mp4";
const framePath = "S:\\linkedin_frame_1728x2160.png";
const assFile = "ParkCore_LinkedIn.ass";

const out4K = "S:\\ParkCore_LinkedIn_TechFrame_4x5.mp4";
const out1080p = "S:\\ParkCore_LinkedIn_TechFrame_1080x1350.mp4";
const deliverableDir = "S:\\Smart-Parking-Management-System\\deliverables";
const brainDir = "C:\\Users\\syeds\\.gemini\\antigravity\\brain\\02319ec5-5583-4c5a-81d0-64a4abb0fba5";

// Ensure UTF-8 ASS content without corrupted symbols
const assContent = `[Script Info]
Title: ParkCore LinkedIn 4:5 Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709
PlayResX: 1728
PlayResY: 2160

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: LinkedInSubtitle,Segoe UI,50,&H00FFFFFF,&H0022D3EE,&H000F172A,&HB0040A18,1,0,0,0,100,100,1.1,0,3,24,0,2,80,80,150,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.50,0:00:02.50,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}ParkCore{\\c&HFFFFFF&} | Autonomous Smart Parking System\\N{\\fs40\\c&H94A3B8&}ARM Cortex-M3 (LPC1768) Digital Twin Architecture
Dialogue: 0,0:00:02.50,0:00:08.20,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}STEP 01:{\\c&HFFFFFF&} Simulation Control Core\\N{\\fs42}Starting discrete master clock & 1000ms SysTick interrupt scheduler in Auto mode.
Dialogue: 0,0:00:08.20,0:00:17.50,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}STEP 02:{\\c&HFFFFFF&} Smart Gate Plaza (Dual-Lane Highway Toll)\\N{\\fs42}Vehicle trips Optical IR beam (GPIO P0.4). ANPR OCR scans plate; 50Hz PWM servo opens 90 deg.
Dialogue: 0,0:00:17.50,0:00:25.50,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}STEP 03:{\\c&HFFFFFF&} Operator Dispatch Console\\N{\\fs42}Multi-class fleet ingestion (Cars $20, Bikes $10, Trucks $40) with dynamic Bubble Sort slot allocation.
Dialogue: 0,0:00:25.50,0:00:36.50,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}STEP 04:{\\c&HFFFFFF&} Main Parking Lot (32-Bay Matrix)\\N{\\fs42}Real-time bitmapped slot occupancy states. Vehicle arrives into Slot #0; clicking bay engages live telemetry.
Dialogue: 0,0:00:36.50,0:00:43.50,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}STEP 05:{\\c&HFFFFFF&} LPC1768 Hardware Diagnostics\\N{\\fs42}100MHz PLL0 master clock, SysTick 10ms timer, dual 50Hz PWM servos, and 115200 UART0 telemetry.
Dialogue: 0,0:00:43.50,0:00:50.00,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}STEP 06:{\\c&HFFFFFF&} Real-Time Event Log\\N{\\fs42}Non-blocking circular ring buffer auditing vehicle arrivals, boom gate activations, and timestamped exit fees.
Dialogue: 0,0:00:50.00,0:00:56.50,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}STEP 07:{\\c&HFFFFFF&} Vehicle Distribution Metrics\\N{\\fs42}Live fleet breakdown & capacity thresholds across Cars (max 16), Bikes (max 10), and Commercial Trucks (max 6).
Dialogue: 0,0:00:56.50,0:01:03.50,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}STEP 08:{\\c&HFFFFFF&} Analytics & Financial Ledger\\N{\\fs42}Duration-based tariff calculation matrix, automated revenue accumulation, and real-time SRAM memory mapping (g_system).
Dialogue: 0,0:01:03.50,0:01:13.00,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}STEP 09:{\\c&HFFFFFF&} Debug Tab & 14-State Deterministic FSM\\N{\\fs42}14 atomic states (IDLE, PROCESS_ENTRY, CALC_FEE, UPDATE_SLOT) driven by 16-bit bitpacked registers.
Dialogue: 0,0:01:13.00,0:01:21.50,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}STEP 10:{\\c&HFFFFFF&} Grand Finale — Full Widescreen Showcase\\N{\\fs42}Synchronized multi-subsystem execution: 2-way highway toll plaza, dual PWM boom gates, and 32-bay telemetry grid.
Dialogue: 0,0:01:21.50,0:01:30.50,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}ParkCore Digital Twin Operating Live\\N{\\fs40\\c&H94A3B8&}Complete autonomous embedded infrastructure at 60 FPS progressive.
`;
fs.writeFileSync("S:\\ParkCore_LinkedIn.ass", "\ufeff" + assContent.trim(), 'utf8');

async function runCommand(args, desc) {
  console.log(`? [START] ${desc}`);
  return new Promise((resolve, reject) => {
    const p = spawn(FFMPEG_PATH, args, { cwd: 'S:\\', stdio: 'inherit' });
    p.on('close', (code) => {
      if (code === 0) {
        console.log(`? [DONE] ${desc}`);
        resolve();
      } else {
        reject(new Error(`${desc} failed with exit code ${code}`));
      }
    });
  });
}

(async () => {
  // 1. High-Res LinkedIn Master (1728x2160 @ 60 FPS)
  const args4K = [
    '-y',
    '-i', in4K,
    '-loop', '1', '-i', framePath,
    '-filter_complex', '[0:v]scale=1728:972:flags=lanczos[vid];[1:v][vid]overlay=0:540:shortest=1[comp];[comp]ass=filename=\'ParkCore_LinkedIn.ass\'[out]',
    '-map', '[out]',
    '-c:v', 'h264_nvenc',
    '-preset', 'p6',
    '-tune', 'hq',
    '-b:v', '22M',
    '-maxrate', '28M',
    '-bufsize', '40M',
    '-r', '60',
    '-pix_fmt', 'yuv420p',
    '-an',
    out4K
  ];

  // 2. Mobile-Optimized LinkedIn Feed Version (1080x1350 @ 60 FPS)
  const args1080p = [
    '-y',
    '-i', in4K,
    '-loop', '1', '-i', framePath,
    '-filter_complex', '[0:v]scale=1728:972:flags=lanczos[vid];[1:v][vid]overlay=0:540:shortest=1[comp];[comp]ass=filename=\'ParkCore_LinkedIn.ass\',scale=1080:1350:flags=lanczos[out]',
    '-map', '[out]',
    '-c:v', 'h264_nvenc',
    '-preset', 'p5',
    '-b:v', '10M',
    '-maxrate', '14M',
    '-bufsize', '20M',
    '-r', '60',
    '-pix_fmt', 'yuv420p',
    '-an',
    out1080p
  ];

  await runCommand(args4K, "LinkedIn 4:5 Master (1728x2160 @ 60fps)");
  await runCommand(args1080p, "LinkedIn 4:5 Mobile Feed (1080x1350 @ 60fps)");

  console.log("?? Synchronizing deliverables across directories...");
  const filesToCopy = [out4K, out1080p, "S:\\ParkCore_LinkedIn.ass"];
  for (const f of filesToCopy) {
    const fname = path.basename(f);
    fs.copyFileSync(f, path.join(deliverableDir, fname));
    fs.copyFileSync(f, path.join(brainDir, fname));
  }

  console.log("?? All LinkedIn 4:5 Deliverables Rendered and Replicated Successfully!");
  console.log("  - 4:5 Master (1728x2160):", out4K, `(${Math.round(fs.statSync(out4K).size / 1024 / 1024)} MB)`);
  console.log("  - 4:5 Feed (1080x1350):", out1080p, `(${Math.round(fs.statSync(out1080p).size / 1024 / 1024)} MB)`);
})();
