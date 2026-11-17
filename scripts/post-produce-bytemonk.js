const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG_PATH = 'C:\\Users\\syeds\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';
const FFPROBE_PATH = 'C:\\Users\\syeds\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';

const ROOT_DIR = path.join(__dirname, '..');
const RAW_DIR = path.join(ROOT_DIR, 'raw_recordings');
const OUT_DIR = path.join(ROOT_DIR, 'deliverables');
const ARTIFACT_DIR = 'C:\\Users\\syeds\\.gemini\\antigravity\\brain\\02319ec5-5583-4c5a-81d0-64a4abb0fba5';
const CURRENT_CONV_DIR = 'C:\\Users\\syeds\\.gemini\\antigravity\\brain\\0e611acf-8f05-4a1b-afde-7fcaf7027cc0';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 1. Identify raw video input
let rawVideoPath = '';
const latestFileTxt = path.join(RAW_DIR, 'bytemonk_latest_recording.txt');
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

// 3. Deliverables Paths (WITHOUT AUDIO as explicitly requested by user)
const master4K = path.join(OUT_DIR, 'ParkCore_ByteMonk_Demo_4K.mp4');
const linkedin1080p = path.join(OUT_DIR, 'ParkCore_ByteMonk_Demo_1080p.mp4');
const thumbnailPng = path.join(OUT_DIR, 'ParkCore_ByteMonk_Thumbnail.png');

// A. Master 4K UHD 60FPS Video (3840x2160, Silent)
console.log('\n🚀 Rendering Byte Monk Master 4K UHD 60FPS Video (3840x2160, No Audio)...');
const filter4K = `[0:v]scale=3840:2160:flags=lanczos,eq=contrast=1.03:brightness=0.01:saturation=1.06,fps=60[v]`;
const res4K = spawnSync(FFMPEG_PATH, [
  '-y',
  '-i', rawVideoPath,
  '-filter_complex', filter4K,
  '-map', '[v]',
  '-an', // NO AUDIO track
  '-c:v', 'libx264',
  '-preset', 'ultrafast',
  '-crf', '18',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  master4K
], { stdio: 'inherit' });

if (res4K.status !== 0) {
  console.error('4K rendering failed, status:', res4K.status);
  process.exit(1);
}
console.log('✅ Byte Monk Master 4K Video generated:', master4K);

// B. LinkedIn 1080p 60FPS Video (1920x1080, Silent)
console.log('\n🚀 Rendering Byte Monk LinkedIn 1080p 60FPS Video (1920x1080, No Audio)...');
const filter1080p = `[0:v]scale=1920:1080:flags=lanczos,eq=contrast=1.02:brightness=0.01:saturation=1.05,fps=60[v]`;
const res1080p = spawnSync(FFMPEG_PATH, [
  '-y',
  '-i', rawVideoPath,
  '-filter_complex', filter1080p,
  '-map', '[v]',
  '-an', // NO AUDIO track
  '-c:v', 'libx264',
  '-preset', 'veryfast',
  '-crf', '20',
  '-maxrate', '12M',
  '-bufsize', '24M',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  linkedin1080p
], { stdio: 'inherit' });

if (res1080p.status !== 0) {
  console.error('1080p rendering failed, status:', res1080p.status);
  process.exit(1);
}
console.log('✅ Byte Monk LinkedIn 1080p Video generated:', linkedin1080p);

// C. High-Impact Wide-Screen 4K Thumbnail (3840x2160)
console.log('\n🚀 Generating High-Impact Wide-Screen 4K Thumbnail...');
// Capture frame during the wide-screen finale shot (at duration - 2s)
const thumbTime = Math.max(5, duration - 2.5);
const resThumb = spawnSync(FFMPEG_PATH, [
  '-y',
  '-ss', thumbTime.toFixed(1),
  '-i', master4K,
  '-frames:v', '1',
  '-q:v', '2',
  thumbnailPng
], { stdio: 'inherit' });

if (resThumb.status !== 0) {
  console.error('Thumbnail capture failed, status:', resThumb.status);
  process.exit(1);
}
console.log('✅ Byte Monk 4K Thumbnail captured:', thumbnailPng);

// 4. Copy deliverables to conversation artifact directory
console.log('\n📦 Copying deliverables to Conversation Artifacts Directory...');
const deliverables = [
  'ParkCore_ByteMonk_Demo_4K.mp4',
  'ParkCore_ByteMonk_Demo_1080p.mp4',
  'ParkCore_ByteMonk_Thumbnail.png'
];

for (const name of deliverables) {
  const src = path.join(OUT_DIR, name);
  if (!fs.existsSync(src)) continue;
  if (fs.existsSync(ARTIFACT_DIR)) {
    const dst = path.join(ARTIFACT_DIR, name);
    fs.copyFileSync(src, dst);
    console.log(`Copied ${name} -> ${dst}`);
  }
  if (fs.existsSync(CURRENT_CONV_DIR)) {
    const dstCurrent = path.join(CURRENT_CONV_DIR, name);
    fs.copyFileSync(src, dstCurrent);
    console.log(`Copied ${name} -> ${dstCurrent}`);
  }
}

console.log('\n🎉 BYTE MONK STYLE CINEMATIC DEMO SUCCESSFULLY PRODUCED & EXPORTED!');
