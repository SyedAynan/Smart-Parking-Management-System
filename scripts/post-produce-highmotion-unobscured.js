const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG_PATH = 'C:\\Users\\syeds\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';
const FFPROBE_PATH = 'C:\\Users\\syeds\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';

const ROOT_DIR = path.join(__dirname, '..');
const RAW_DIR = path.join(ROOT_DIR, 'raw_recordings');
const OUT_DIR = path.join(ROOT_DIR, 'deliverables');
const ARTIFACT_DIR = 'C:\\Users\\syeds\\.gemini\\antigravity\\brain\\02319ec5-5583-4c5a-81d0-64a4abb0fba5';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 1. Identify raw video input
let rawVideoPath = '';
const latestFileTxt = path.join(RAW_DIR, 'cinematic_unobscured_latest.txt');
if (fs.existsSync(latestFileTxt)) {
  rawVideoPath = fs.readFileSync(latestFileTxt, 'utf-8').trim();
}

if (!rawVideoPath || !fs.existsSync(rawVideoPath)) {
  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    console.error('❌ No raw recording .webm found in', RAW_DIR);
    process.exit(1);
  }
  files.sort((a, b) => fs.statSync(path.join(RAW_DIR, b)).mtimeMs - fs.statSync(path.join(RAW_DIR, a)).mtimeMs);
  rawVideoPath = path.join(RAW_DIR, files[0]);
}

console.log('🎥 Source Raw Video:', rawVideoPath);

// 2. Probe video duration
const probeResult = spawnSync(FFPROBE_PATH, [
  '-v', 'error',
  '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1',
  rawVideoPath
], { encoding: 'utf-8' });

const duration = Math.max(10, parseFloat(probeResult.stdout.trim()) || 60);
console.log(`⏱️ Detected Video Duration: ${duration.toFixed(2)}s`);

// 3. Output paths
const master4K = path.join(OUT_DIR, 'ParkCore_Cinematic_Unobscured_Explainer_4K.mp4');
const sDrive4K = 'S:\\ParkCore_Cinematic_Unobscured_Explainer_4K.mp4';
const brain4K = path.join(ARTIFACT_DIR, 'ParkCore_Cinematic_Unobscured_Explainer_4K.mp4');

const master1080p = path.join(OUT_DIR, 'ParkCore_Cinematic_Unobscured_Explainer_1080p.mp4');
const brain1080p = path.join(ARTIFACT_DIR, 'ParkCore_Cinematic_Unobscured_Explainer_1080p.mp4');

// A. Master 4K UHD 60FPS Video (3840x2160, Silent, Lanczos, Unsharp)
console.log('\n🚀 Rendering 4K UHD 60FPS Video (3840x2160, No Audio, Lanczos + Unsharp)...');
const filter4K = `[0:v]scale=3840:2160:flags=lanczos,unsharp=5:5:0.6:3:3:0.0,eq=contrast=1.03:brightness=0.01:saturation=1.05,fps=60[v]`;

let res4K = spawnSync(FFMPEG_PATH, [
  '-y',
  '-i', rawVideoPath,
  '-filter_complex', filter4K,
  '-map', '[v]',
  '-an', // NO AUDIO
  '-c:v', 'h264_nvenc',
  '-preset', 'p5',
  '-tune', 'hq',
  '-rc', 'vbr',
  '-cq', '16',
  '-b:v', '25M',
  '-maxrate', '35M',
  '-bufsize', '50M',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  master4K
], { stdio: 'inherit' });

if (res4K.status !== 0) {
  console.log('⚠️ NVENC fallback to libx264...');
  res4K = spawnSync(FFMPEG_PATH, [
    '-y',
    '-i', rawVideoPath,
    '-filter_complex', filter4K,
    '-map', '[v]',
    '-an',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-crf', '17',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    master4K
  ], { stdio: 'inherit' });
}

if (res4K.status !== 0) {
  console.error('❌ 4K rendering failed');
  process.exit(1);
}

console.log('✅ Master 4K Video generated:', master4K);

try {
  fs.copyFileSync(master4K, sDrive4K);
  console.log('✅ Copied to:', sDrive4K);
} catch (e) {
  console.warn('Could not copy to', sDrive4K, e.message);
}

try {
  if (fs.existsSync(ARTIFACT_DIR)) {
    fs.copyFileSync(master4K, brain4K);
    console.log('✅ Copied to artifact dir:', brain4K);
  }
} catch (e) {
  console.warn('Could not copy to brain dir:', e.message);
}

// B. 1080p 60FPS Video
console.log('\n🚀 Rendering 1080p 60FPS Video (1920x1080, No Audio)...');
const filter1080p = `[0:v]scale=1920:1080:flags=lanczos,eq=contrast=1.02:brightness=0.01:saturation=1.04,fps=60[v]`;
const res1080p = spawnSync(FFMPEG_PATH, [
  '-y',
  '-i', rawVideoPath,
  '-filter_complex', filter1080p,
  '-map', '[v]',
  '-an',
  '-c:v', 'libx264',
  '-preset', 'veryfast',
  '-crf', '19',
  '-maxrate', '12M',
  '-bufsize', '24M',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  master1080p
], { stdio: 'inherit' });

if (res1080p.status === 0) {
  console.log('✅ 1080p Video generated:', master1080p);
  try {
    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(master1080p, brain1080p);
    }
  } catch (e) {}
}

console.log('\n🎉 ALL RECORDING & POST-PRODUCTION DELIVERABLES COMPLETED!');
