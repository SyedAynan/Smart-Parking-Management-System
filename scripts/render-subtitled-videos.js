const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG_PATH = "C:\\Users\\syeds\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe";
const in4K = "S:\\ParkCore_Cinematic_Complete_Walkthrough_4K.mp4";
const assFile = "ParkCore_Walkthrough.ass";
const outSub4K = "S:\\ParkCore_Cinematic_Complete_Walkthrough_Subtitled_4K.mp4";
const outSub1080p = "S:\\ParkCore_Cinematic_Complete_Walkthrough_Subtitled_1080p.mp4";
const deliverableDir = "S:\\Smart-Parking-Management-System\\deliverables";
const brainDir = "C:\\Users\\syeds\\.gemini\\antigravity\\brain\\02319ec5-5583-4c5a-81d0-64a4abb0fba5";

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
  // 1. Burned-in 4K Subtitled Master
  const args4K = [
    '-y',
    '-i', in4K,
    '-vf', `ass=filename='${assFile}'`,
    '-c:v', 'h264_nvenc',
    '-preset', 'p6',
    '-tune', 'hq',
    '-b:v', '26M',
    '-maxrate', '32M',
    '-bufsize', '48M',
    '-r', '60',
    '-pix_fmt', 'yuv420p',
    '-an',
    outSub4K
  ];

  // 2. Burned-in 1080p Subtitled Companion
  const args1080p = [
    '-y',
    '-i', in4K,
    '-vf', `scale=1920:1080:flags=lanczos,ass=filename='${assFile}'`,
    '-c:v', 'h264_nvenc',
    '-preset', 'p5',
    '-b:v', '12M',
    '-r', '60',
    '-pix_fmt', 'yuv420p',
    '-an',
    outSub1080p
  ];

  await runCommand(args4K, "4K Subtitled Video Master");
  await runCommand(args1080p, "1080p Subtitled Video Companion");

  // Replicate to deliverables and brain artifact directory
  console.log("?? Synchronizing deliverables across directories...");
  const filesToCopy = [
    outSub4K,
    outSub1080p,
    "S:\\ParkCore_Walkthrough.srt",
    "S:\\ParkCore_Walkthrough.ass"
  ];

  for (const f of filesToCopy) {
    const fname = path.basename(f);
    fs.copyFileSync(f, path.join(deliverableDir, fname));
    fs.copyFileSync(f, path.join(brainDir, fname));
  }

  console.log("?? All Subtitled Master Deliverables Successfully Rendered and Replicated!");
  console.log("  - 4K Master Subtitled:", outSub4K, `(${Math.round(fs.statSync(outSub4K).size / 1024 / 1024)} MB)`);
  console.log("  - 1080p Companion Subtitled:", outSub1080p, `(${Math.round(fs.statSync(outSub1080p).size / 1024 / 1024)} MB)`);
})();
