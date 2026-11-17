const fs = require('fs');

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
Dialogue: 0,0:00:08.20,0:00:17.50,LinkedInSubtitle,,0,0,0,,{\\c&H22D3EE&}STEP 02:{\\c&HFFFFFF&} Smart Gate Plaza (Dual-Lane Highway Toll)\\N{\\fs42}Vehicle trips Optical IR beam (GPIO P0.4). ANPR OCR scans plate; 50Hz PWM servo opens 90°.
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

fs.writeFileSync("S:\\ParkCore_LinkedIn.ass", assContent.trim());
console.log("? ParkCore_LinkedIn.ass created.");
