const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG_PATH = "C:\\Users\\syeds\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe";
const rawDir = path.join(__dirname, '..', 'raw_recordings');
const deliverableDir = path.join(__dirname, '..', 'deliverables');
const brainDir = "C:\\Users\\syeds\\.gemini\\antigravity\\brain\\02319ec5-5583-4c5a-81d0-64a4abb0fba5";

if (!fs.existsSync(deliverableDir)) fs.mkdirSync(deliverableDir, { recursive: true });

// Find latest webm file
const files = fs.readdirSync(rawDir)
  .filter(f => f.endsWith('.webm'))
  .map(f => ({ name: f, time: fs.statSync(path.join(rawDir, f)).mtimeMs }))
  .sort((a, b) => b.time - a.time);

if (files.length === 0) {
  console.error("? No raw recording webm found in", rawDir);
  process.exit(1);
}

const latestRaw = path.join(rawDir, files[0].name);
console.log("?? Found Latest Raw Recording:", latestRaw);

const output4K = "S:\\ParkCore_Cinematic_Complete_Walkthrough_4K.mp4";
const output1080p = "S:\\ParkCore_Cinematic_Complete_Walkthrough_1080p.mp4";

// Try hardware NVENC 4K render
async function render4K() {
  console.log("? Starting 4K UHD Master Render (3840x2160 @ 60fps)...");
  return new Promise((resolve, reject) => {
    const nvencArgs = [
      '-y',
      '-i', latestRaw,
      '-vf', 'scale=3840:2160:flags=lanczos,unsharp=5:5:0.6:3:3:0.0,eq=contrast=1.04:saturation=1.05',
      '-c:v', 'h264_nvenc',
      '-preset', 'p6',
      '-tune', 'hq',
      '-b:v', '26M',
      '-maxrate', '32M',
      '-bufsize', '48M',
      '-r', '60',
      '-pix_fmt', 'yuv420p',
      '-an',
      output4K
    ];

    console.log("Command:", FFMPEG_PATH, nvencArgs.join(" "));
    const proc = spawn(FFMPEG_PATH, nvencArgs, { stdio: 'inherit' });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log("? 4K NVENC Render succeeded!");
        resolve();
      } else {
        console.warn("?? NVENC failed with code", code, "- Falling back to libx264...");
        const cpuArgs = [
          '-y',
          '-i', latestRaw,
          '-vf', 'scale=3840:2160:flags=lanczos,unsharp=5:5:0.6:3:3:0.0,eq=contrast=1.04:saturation=1.05',
          '-c:v', 'libx264',
          '-preset', 'fast',
          '-crf', '16',
          '-r', '60',
          '-pix_fmt', 'yuv420p',
          '-an',
          output4K
        ];
        const cpuProc = spawn(FFMPEG_PATH, cpuArgs, { stdio: 'inherit' });
        cpuProc.on('close', (cpuCode) => {
          if (cpuCode === 0) resolve();
          else reject(new Error("CPU render failed with code " + cpuCode));
        });
      }
    });
  });
}

// Render 1080p companion
async function render1080p() {
  console.log("? Starting 1080p Companion Render (1920x1080 @ 60fps)...");
  return new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-i', latestRaw,
      '-vf', 'scale=1920:1080:flags=lanczos,unsharp=3:3:0.4:3:3:0.0,eq=contrast=1.03:saturation=1.04',
      '-c:v', 'h264_nvenc',
      '-preset', 'p5',
      '-b:v', '12M',
      '-r', '60',
      '-pix_fmt', 'yuv420p',
      '-an',
      output1080p
    ];
    const proc = spawn(FFMPEG_PATH, args, { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) {
        console.log("? 1080p Render succeeded!");
        resolve();
      } else {
        const cpuArgs = [
          '-y',
          '-i', latestRaw,
          '-vf', 'scale=1920:1080:flags=lanczos,unsharp=3:3:0.4:3:3:0.0,eq=contrast=1.03:saturation=1.04',
          '-c:v', 'libx264',
          '-preset', 'fast',
          '-crf', '18',
          '-r', '60',
          '-pix_fmt', 'yuv420p',
          '-an',
          output1080p
        ];
        const cpuProc = spawn(FFMPEG_PATH, cpuArgs, { stdio: 'inherit' });
        cpuProc.on('close', (c) => c === 0 ? resolve() : reject(new Error("1080p CPU render failed: " + c)));
      }
    });
  });
}

(async () => {
  await render4K();
  await render1080p();

  // Replicate deliverables to project deliverables folder and conversation brain folder
  console.log("?? Replicating deliverables across target directories...");
  const deliv4K = path.join(deliverableDir, path.basename(output4K));
  const deliv1080p = path.join(deliverableDir, path.basename(output1080p));
  const brain4K = path.join(brainDir, path.basename(output4K));
  const brain1080p = path.join(brainDir, path.basename(output1080p));

  fs.copyFileSync(output4K, deliv4K);
  fs.copyFileSync(output1080p, deliv1080p);
  fs.copyFileSync(output4K, brain4K);
  fs.copyFileSync(output1080p, brain1080p);

  console.log("? All Deliverables Synchronized Successfully:");
  console.log("  - 4K Master Root:", output4K, `(${Math.round(fs.statSync(output4K).size / 1024 / 1024)} MB)`);
  console.log("  - 4K Deliverables:", deliv4K);
  console.log("  - 4K Brain Artifact:", brain4K);
  console.log("  - 1080p Master Root:", output1080p, `(${Math.round(fs.statSync(output1080p).size / 1024 / 1024)} MB)`);
})();
