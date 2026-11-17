const fs = require('fs');
const path = require('path');

// 1. SRT Format
const srtContent = `1
00:00:00,500 --> 00:00:02,500
ParkCore | Autonomous Smart Parking System
ARM Cortex-M3 (LPC1768) Digital Twin Architecture

2
00:00:02,500 --> 00:00:08,200
Step 1: Simulation Control Core
Starting discrete master clock & 1000ms periodic SysTick interrupt scheduler in Auto mode.

3
00:00:08,200 --> 00:00:17,500
Step 2: Smart Gate Plaza (Dual-Lane Highway Toll)
Optical IR beam trips GPIO P0.4 interrupt. ANPR OCR scans license plate; 50Hz PWM servo arm raises 90°.

4
00:00:17,500 --> 00:00:25,500
Step 3: Operator Dispatch Console
Multi-class fleet ingestion (Cars $20, Bikes $10, Commercial Trucks $40) with dynamic Bubble Sort slot allocation.

5
00:00:25,500 --> 00:00:36,500
Step 4: Main Parking Lot (32-Bay Matrix)
Real-time bitmapped slot occupancy states. Vehicle arrives into Slot #0; clicking bay engages live hardware telemetry HUD.

6
00:00:36,500 --> 00:00:43,500
Step 5: LPC1768 Hardware Diagnostics
100MHz PLL0 master clock, SysTick 10ms timer, dual 50Hz PWM servos, and 115200 8-N-1 UART0 debug telemetry.

7
00:00:43,500 --> 00:00:50,000
Step 6: Real-Time Event Log
Non-blocking circular ring buffer auditing vehicle arrivals, boom gate activations, and timestamped exit settlements.

8
00:00:50,000 --> 00:00:56,500
Step 7: Vehicle Distribution Metrics
Live fleet breakdown & capacity thresholds across Cars (max 16), Bikes (max 10), and Commercial Trucks (max 6).

9
00:00:56,500 --> 00:01:03,500
Step 8: Analytics & Financial Ledger
Duration-based tariff calculation matrix, automated revenue accumulation, and real-time SRAM memory mapping (g_system).

10
00:01:03,500 --> 00:01:13,000
Step 9: Debug Tab & 14-State Deterministic FSM
14 atomic states (IDLE, PROCESS_ENTRY, CALC_FEE, UPDATE_SLOT) driven by 16-bit bitpacked registers with zero race conditions.

11
00:01:13,000 --> 00:01:21,500
Step 10: Grand Finale — Full Widescreen Showcase
Synchronized multi-subsystem execution: 2-way highway toll plaza, dual PWM boom gates, and 32-bay telemetry grid.

12
00:01:21,500 --> 00:01:30,500
ParkCore Digital Twin Operating Live
Complete autonomous embedded infrastructure at 60 FPS progressive.
`;

fs.writeFileSync("S:\\ParkCore_Walkthrough.srt", srtContent.trim());
fs.writeFileSync("S:\\Smart-Parking-Management-System\\deliverables\\ParkCore_Walkthrough.srt", srtContent.trim());
fs.writeFileSync("C:\\Users\\syeds\\.gemini\\antigravity\\brain\\02319ec5-5583-4c5a-81d0-64a4abb0fba5\\ParkCore_Walkthrough.srt", srtContent.trim());

// 2. ASS Format (Advanced SubStation Alpha with Cyber Styling & 4K Coordinates)
// PlayResX: 3840, PlayResY: 2160
// Style: Bottom-center subtitle with dark cyan translucent backing box, cyan accent bold keywords
const assHeader = `[Script Info]
Title: ParkCore Walkthrough Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709
PlayResX: 3840
PlayResY: 2160

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: CyberBottom,Segoe UI,54,&H00FFFFFF,&H0022D3EE,&H000F172A,&HB0040A18,1,0,0,0,100,100,1.2,0,3,28,0,2,120,120,72,1
Style: CyberTop,Segoe UI,54,&H00FFFFFF,&H0022D3EE,&H000F172A,&HB0040A18,1,0,0,0,100,100,1.2,0,3,28,0,8,120,120,68,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.50,0:00:02.50,CyberBottom,,0,0,0,,{\\c&H22D3EE&}ParkCore{\\c&HFFFFFF&} | Autonomous Smart Parking System\\N{\\fs42\\c&H94A3B8&}ARM Cortex-M3 (LPC1768) Digital Twin Architecture
Dialogue: 0,0:00:02.50,0:00:08.20,CyberBottom,,0,0,0,,{\\c&H22D3EE&}STEP 01:{\\c&HFFFFFF&} Simulation Control Core\\N{\\fs44}Starting discrete master clock & 1000ms periodic SysTick interrupt scheduler in Auto mode.
Dialogue: 0,0:00:08.20,0:00:17.50,CyberTop,,0,0,0,,{\\c&H22D3EE&}STEP 02:{\\c&HFFFFFF&} Smart Gate Plaza (Dual-Lane Highway Toll)\\N{\\fs44}Vehicle trips Optical IR beam (GPIO P0.4). ANPR OCR scans license plate; 50Hz PWM servo arm raises 90°.
Dialogue: 0,0:00:17.50,0:00:25.50,CyberBottom,,0,0,0,,{\\c&H22D3EE&}STEP 03:{\\c&HFFFFFF&} Operator Dispatch Console\\N{\\fs44}Multi-class fleet ingestion (Cars $20, Bikes $10, Commercial Trucks $40) with dynamic Bubble Sort slot allocation.
Dialogue: 0,0:00:25.50,0:00:36.50,CyberBottom,,0,0,0,,{\\c&H22D3EE&}STEP 04:{\\c&HFFFFFF&} Main Parking Lot (32-Bay Matrix)\\N{\\fs44}Real-time bitmapped slot occupancy states. Vehicle arrives into Slot #0; clicking bay engages live hardware telemetry HUD.
Dialogue: 0,0:00:36.50,0:00:43.50,CyberBottom,,0,0,0,,{\\c&H22D3EE&}STEP 05:{\\c&HFFFFFF&} LPC1768 Hardware Diagnostics\\N{\\fs44}100MHz PLL0 master clock, SysTick 10ms timer, dual 50Hz PWM servos, and 115200 8-N-1 UART0 debug telemetry.
Dialogue: 0,0:00:43.50,0:00:50.00,CyberBottom,,0,0,0,,{\\c&H22D3EE&}STEP 06:{\\c&HFFFFFF&} Real-Time Event Log\\N{\\fs44}Non-blocking circular ring buffer auditing vehicle arrivals, boom gate activations, and timestamped exit settlements.
Dialogue: 0,0:00:50.00,0:00:56.50,CyberBottom,,0,0,0,,{\\c&H22D3EE&}STEP 07:{\\c&HFFFFFF&} Vehicle Distribution Metrics\\N{\\fs44}Live fleet breakdown & capacity thresholds across Cars (max 16), Bikes (max 10), and Commercial Trucks (max 6).
Dialogue: 0,0:00:56.50,0:01:03.50,CyberBottom,,0,0,0,,{\\c&H22D3EE&}STEP 08:{\\c&HFFFFFF&} Analytics & Financial Ledger\\N{\\fs44}Duration-based tariff calculation matrix, automated revenue accumulation, and real-time SRAM memory mapping (g_system).
Dialogue: 0,0:01:03.50,0:01:13.00,CyberBottom,,0,0,0,,{\\c&H22D3EE&}STEP 09:{\\c&HFFFFFF&} Debug Tab & 14-State Deterministic FSM\\N{\\fs44}14 atomic states (IDLE, PROCESS_ENTRY, CALC_FEE, UPDATE_SLOT) driven by 16-bit bitpacked registers with zero race conditions.
Dialogue: 0,0:01:13.00,0:01:21.50,CyberBottom,,0,0,0,,{\\c&H22D3EE&}STEP 10:{\\c&HFFFFFF&} Grand Finale — Full Widescreen Showcase\\N{\\fs44}Synchronized multi-subsystem execution: 2-way highway toll plaza, dual PWM boom gates, and 32-bay telemetry grid.
Dialogue: 0,0:01:21.50,0:01:30.50,CyberBottom,,0,0,0,,{\\c&H22D3EE&}ParkCore Digital Twin Operating Live\\N{\\fs44\\c&H94A3B8&}Complete autonomous embedded infrastructure at 60 FPS progressive.
`;

fs.writeFileSync("S:\\ParkCore_Walkthrough.ass", assHeader.trim());
fs.writeFileSync("S:\\Smart-Parking-Management-System\\deliverables\\ParkCore_Walkthrough.ass", assHeader.trim());
fs.writeFileSync("C:\\Users\\syeds\\.gemini\\antigravity\\brain\\02319ec5-5583-4c5a-81d0-64a4abb0fba5\\ParkCore_Walkthrough.ass", assHeader.trim());

console.log("? SRT and ASS subtitle files created successfully.");
