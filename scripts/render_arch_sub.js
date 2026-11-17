const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG_PATH = "C:\\Users\\syeds\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe";
const inArch4K = "S:\\parkcore-cinematic-flow-45s-4K.mp4";
const assArchFile = "ParkCore_Architecture.ass";
const outSubArch4K = "S:\\parkcore-cinematic-flow-45s-Subtitled-4K.mp4";
const deliverableDir = "S:\\Smart-Parking-Management-System\\deliverables";
const brainDir = "C:\\Users\\syeds\\.gemini\\antigravity\\brain\\02319ec5-5583-4c5a-81d0-64a4abb0fba5";

const srtArch = `1
00:00:00,500 --> 00:00:08,000
ParkCore | System Architecture & Data Flow
High-throughput ARM Cortex-M3 microcontroller hardware bus and real-time simulator.

2
00:00:08,000 --> 00:00:18,500
Sensing & Actuation Subsystem
Optical IR beam sensors (GPIO P0.4/P2.0) and dual 50Hz PWM servo boom gates.

3
00:00:18,500 --> 00:00:28,500
LPC1768 Core Microcontroller
100MHz PLL0 master clock, SysTick 10ms hardware interrupt, and UART0 115200 serial bus.

4
00:00:28,500 --> 00:00:36,500
14-State Finite State Machine (FSM)
Deterministic atomic transitions governed by 16-bit bitpacked hardware flags.

5
00:00:36,500 --> 00:00:44,500
Next.js Digital Twin & Telemetry Stream
WebSocket and shared SRAM memory map (g_system) synchronizing dashboard state.
`;

fs.writeFileSync("S:\\ParkCore_Architecture.srt", srtArch.trim());
fs.writeFileSync(path.join(deliverableDir, "ParkCore_Architecture.srt"), srtArch.trim());
fs.writeFileSync(path.join(brainDir, "ParkCore_Architecture.srt"), srtArch.trim());

const assArch = `[Script Info]
Title: ParkCore Architecture Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709
PlayResX: 3840
PlayResY: 2160

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: CyberArch,Segoe UI,54,&H00FFFFFF,&H0022D3EE,&H000F172A,&HB0040A18,1,0,0,0,100,100,1.2,0,3,28,0,2,120,120,72,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.50,0:00:08.00,CyberArch,,0,0,0,,{\\c&H22D3EE&}ParkCore | System Architecture & Data Flow\\N{\\fs44}High-throughput ARM Cortex-M3 microcontroller hardware bus and real-time simulator.
Dialogue: 0,0:00:08.00,0:00:18.50,CyberArch,,0,0,0,,{\\c&H22D3EE&}Sensing & Actuation Subsystem\\N{\\fs44}Optical IR beam sensors (GPIO P0.4/P2.0) and dual 50Hz PWM servo boom gates.
Dialogue: 0,0:00:18.50,0:00:28.50,CyberArch,,0,0,0,,{\\c&H22D3EE&}LPC1768 Core Microcontroller\\N{\\fs44}100MHz PLL0 master clock, SysTick 10ms hardware interrupt, and UART0 115200 serial bus.
Dialogue: 0,0:00:28.50,0:00:36.50,CyberArch,,0,0,0,,{\\c&H22D3EE&}14-State Finite State Machine (FSM)\\N{\\fs44}Deterministic atomic transitions governed by 16-bit bitpacked hardware flags.
Dialogue: 0,0:00:36.50,0:00:44.50,CyberArch,,0,0,0,,{\\c&H22D3EE&}Next.js Digital Twin & Telemetry Stream\\N{\\fs44}WebSocket and shared SRAM memory map (g_system) synchronizing dashboard state.
`;

fs.writeFileSync("S:\\ParkCore_Architecture.ass", assArch.trim());
fs.writeFileSync(path.join(deliverableDir, "ParkCore_Architecture.ass"), assArch.trim());
fs.writeFileSync(path.join(brainDir, "ParkCore_Architecture.ass"), assArch.trim());

// Render Subtitled 4K Architecture Video
const argsArch = [
  '-y',
  '-i', inArch4K,
  '-vf', `ass=filename='${assArchFile}'`,
  '-c:v', 'h264_nvenc',
  '-preset', 'p6',
  '-tune', 'hq',
  '-b:v', '26M',
  '-maxrate', '32M',
  '-bufsize', '48M',
  '-r', '30',
  '-pix_fmt', 'yuv420p',
  '-an',
  outSubArch4K
];

console.log("? Rendering 4K Subtitled Architecture Video...");
const proc = spawn(FFMPEG_PATH, argsArch, { cwd: 'S:\\', stdio: 'inherit' });
proc.on('close', (code) => {
  if (code === 0) {
    fs.copyFileSync(outSubArch4K, path.join(deliverableDir, path.basename(outSubArch4K)));
    fs.copyFileSync(outSubArch4K, path.join(brainDir, path.basename(outSubArch4K)));
    console.log("? 4K Subtitled Architecture Video Rendered and Replicated!");
  } else {
    console.error("? Failed with code", code);
  }
});
