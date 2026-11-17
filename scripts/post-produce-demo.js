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
const latestFileTxt = path.join(RAW_DIR, 'latest_recording.txt');
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

const duration = Math.max(10, parseFloat(probeResult.stdout.trim()) || 140);
console.log(`⏱️ Detected Video Duration: ${duration.toFixed(2)}s`);

// 3. Audio generation: High-tech ambient electronic cybernetic soundtrack
const audioWav = path.join(OUT_DIR, 'soundtrack.wav');
console.log('🎵 Generating Ambient High-Tech Cybernetic Soundtrack...');

const audioExpr = `0.08*sin(2*PI*55*t)+0.06*sin(2*PI*110*t)*exp(-2.5*mod(t,2))+0.05*sin(2*PI*(220+55*sin(0.4*t))*t)*exp(-3.5*mod(t,0.5))+0.035*sin(2*PI*440*t)*exp(-5*mod(t,0.25))+0.02*sin(2*PI*880*t)*exp(-6*mod(t,1))`;
const audioInput = `aevalsrc=exprs='${audioExpr}':s=48000`;
const audioEffects = `aecho=0.8:0.85:80|160:0.35|0.25,afade=t=in:ss=0:d=2.5,afade=t=out:st=${(duration - 3.5).toFixed(2)}:d=3.5`;

const audioRes = spawnSync(FFMPEG_PATH, [
  '-y',
  '-f', 'lavfi',
  '-i', audioInput,
  '-t', duration.toFixed(2),
  '-af', audioEffects,
  '-ac', '2',
  '-ar', '48000',
  audioWav
], { stdio: 'inherit' });

if (audioRes.status !== 0) {
  console.error('Audio generation failed, status:', audioRes.status);
  process.exit(1);
}
console.log('✅ Soundtrack synthesized successfully.');

// 4. Output Deliverables
const master4K = path.join(OUT_DIR, 'ParkCore_Cinematic_Demo_4K.mp4');
const linkedin1080p = path.join(OUT_DIR, 'ParkCore_LinkedIn_Demo_1080p.mp4');
const mobile9x16 = path.join(OUT_DIR, 'ParkCore_LinkedIn_Mobile_9x16.mp4');
const thumbnailPng = path.join(OUT_DIR, 'ParkCore_LinkedIn_Thumbnail.png');

// A. Master 4K UHD 60FPS Video (3840x2160)
console.log('\n🚀 Rendering Master 4K UHD 60FPS Video (3840x2160)...');
const filter4K = `[0:v]scale=3840:2160:flags=lanczos,eq=contrast=1.03:brightness=0.01:saturation=1.06,vignette=PI/4,fps=60[v]`;
const res4K = spawnSync(FFMPEG_PATH, [
  '-y',
  '-i', rawVideoPath,
  '-i', audioWav,
  '-filter_complex', filter4K,
  '-map', '[v]',
  '-map', '1:a',
  '-c:v', 'libx264',
  '-preset', 'ultrafast',
  '-crf', '18',
  '-pix_fmt', 'yuv420p',
  '-c:a', 'aac',
  '-b:a', '256k',
  '-shortest',
  '-movflags', '+faststart',
  master4K
], { stdio: 'inherit' });

if (res4K.status !== 0) {
  console.error('4K rendering failed, status:', res4K.status);
  process.exit(1);
}
console.log('✅ Master 4K Video generated:', master4K);

// B. LinkedIn 16:9 1080p MP4 (1920x1080, optimized for web feed)
console.log('\n🚀 Rendering LinkedIn 1080p 60FPS Video (1920x1080)...');
const filter1080p = `[0:v]scale=1920:1080:flags=lanczos,eq=contrast=1.02:brightness=0.01:saturation=1.05,fps=60[v]`;
const res1080p = spawnSync(FFMPEG_PATH, [
  '-y',
  '-i', rawVideoPath,
  '-i', audioWav,
  '-filter_complex', filter1080p,
  '-map', '[v]',
  '-map', '1:a',
  '-c:v', 'libx264',
  '-preset', 'veryfast',
  '-crf', '20',
  '-maxrate', '12M',
  '-bufsize', '24M',
  '-pix_fmt', 'yuv420p',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-shortest',
  '-movflags', '+faststart',
  linkedin1080p
], { stdio: 'inherit' });

if (res1080p.status !== 0) {
  console.error('1080p rendering failed, status:', res1080p.status);
  process.exit(1);
}
console.log('✅ LinkedIn 1080p Video generated:', linkedin1080p);

// C. 9:16 Mobile Vertical Video (1080x1920)
console.log('\n🚀 Rendering 9:16 Mobile Vertical Video (1080x1920)...');
const filterVertical = `[0:v]split=2[bg_src][fg_src];[bg_src]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=25:5,eq=brightness=-0.15[bg];[fg_src]scale=1080:675:flags=lanczos[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2[v]`;
const resVertical = spawnSync(FFMPEG_PATH, [
  '-y',
  '-i', rawVideoPath,
  '-i', audioWav,
  '-filter_complex', filterVertical,
  '-map', '[v]',
  '-map', '1:a',
  '-c:v', 'libx264',
  '-preset', 'ultrafast',
  '-crf', '21',
  '-pix_fmt', 'yuv420p',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-shortest',
  '-movflags', '+faststart',
  mobile9x16
], { stdio: 'inherit' });

if (resVertical.status !== 0) {
  console.error('9:16 vertical rendering failed, status:', resVertical.status);
  process.exit(1);
}
console.log('✅ Mobile 9:16 Video generated:', mobile9x16);

// D. High-Impact 4K Thumbnail (3840x2160)
console.log('\n🚀 Generating High-Impact 4K Thumbnail...');
const thumbTime = Math.min(42, duration * 0.4);
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
console.log('✅ 4K Thumbnail captured:', thumbnailPng);

// 5. Copy all deliverables to conversation artifact directory
console.log('\n📦 Copying deliverables to Conversation Artifacts Directory...');
const deliverables = [
  'ParkCore_Cinematic_Demo_4K.mp4',
  'ParkCore_LinkedIn_Demo_1080p.mp4',
  'ParkCore_LinkedIn_Mobile_9x16.mp4',
  'ParkCore_LinkedIn_Thumbnail.png'
];

for (const name of deliverables) {
  const src = path.join(OUT_DIR, name);
  const dst = path.join(ARTIFACT_DIR, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`Copied ${name} -> ${dst}`);
  }
}

console.log('\n🎉 ALL CINEMATIC DELIVERABLES SUCCESSFULLY PRODUCED & EXPORTED!');
