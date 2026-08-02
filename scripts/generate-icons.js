const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// Draw Valora app icon onto a PNG buffer
function createValoraIcon(size, isRound = false, isForeground = false) {
  const png = new PNG({ width: size, height: size });

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);

      // Mask outside circle if round icon or outer margin
      let inBounds = true;
      if (isRound && dist > maxR - 1) {
        inBounds = false;
      }

      if (!inBounds) {
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
        continue;
      }

      // Background color: Dark midnight indigo (#0a0b16) unless foreground only
      let r = 10, g = 11, b = 22, a = 255;
      if (isForeground) {
        r = 0; g = 0; b = 0; a = 0;
      }

      // Rounded squircle background box if not pure foreground
      if (!isForeground && !isRound) {
        const cornerR = size * 0.22;
        const qx = Math.max(Math.abs(dx) - (size / 2 - cornerR), 0);
        const qy = Math.max(Math.abs(dy) - (size / 2 - cornerR), 0);
        const cornerDist = Math.hypot(qx, qy);
        if (cornerDist > cornerR) {
          png.data[idx] = 0;
          png.data[idx + 1] = 0;
          png.data[idx + 2] = 0;
          png.data[idx + 3] = 0;
          continue;
        }
      }

      // Draw Valora Diamond & Emerald Logo
      const scale = size / 192;
      const nx = dx / scale;
      const ny = dy / scale;

      // Hexagon / Diamond outline radius 45px
      const absX = Math.abs(nx);
      const absY = Math.abs(ny);
      // Hexagon SDF formula
      const hexD = Math.max(absX * 0.866 + absY * 0.5, absY);
      
      const isHexBorder = Math.abs(hexD - 48) < 4;
      const isHexFill = hexD < 48;

      const dotDist = Math.hypot(nx, ny);
      const isCenterDot = dotDist <= 16;
      const isRing = Math.abs(dotDist - 28) <= 2.5;

      if (isCenterDot) {
        // Vibrant Emerald Green (#10b981)
        r = 16; g = 185; b = 129; a = 255;
      } else if (isRing) {
        // Teal Accent Ring (#34d399)
        r = 52; g = 211; b = 153; a = 255;
      } else if (isHexBorder) {
        // Royal Indigo Border (#818cf8)
        r = 129; g = 140; b = 248; a = 255;
      } else if (isHexFill) {
        // Glassmorphic Indigo fill
        const alphaBlend = 0.35;
        r = Math.round(r * (1 - alphaBlend) + 99 * alphaBlend);
        g = Math.round(g * (1 - alphaBlend) + 102 * alphaBlend);
        b = Math.round(b * (1 - alphaBlend) + 241 * alphaBlend);
        if (isForeground) a = 180;
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }

  return PNG.sync.write(png);
}

const targets = [
  // Android Mipmaps
  { dir: 'android/app/src/main/res/mipmap-mdpi', name: 'ic_launcher.png', size: 48, round: false, fg: false },
  { dir: 'android/app/src/main/res/mipmap-mdpi', name: 'ic_launcher_round.png', size: 48, round: true, fg: false },
  { dir: 'android/app/src/main/res/mipmap-mdpi', name: 'ic_launcher_foreground.png', size: 108, round: false, fg: true },

  { dir: 'android/app/src/main/res/mipmap-hdpi', name: 'ic_launcher.png', size: 72, round: false, fg: false },
  { dir: 'android/app/src/main/res/mipmap-hdpi', name: 'ic_launcher_round.png', size: 72, round: true, fg: false },
  { dir: 'android/app/src/main/res/mipmap-hdpi', name: 'ic_launcher_foreground.png', size: 162, round: false, fg: true },

  { dir: 'android/app/src/main/res/mipmap-xhdpi', name: 'ic_launcher.png', size: 96, round: false, fg: false },
  { dir: 'android/app/src/main/res/mipmap-xhdpi', name: 'ic_launcher_round.png', size: 96, round: true, fg: false },
  { dir: 'android/app/src/main/res/mipmap-xhdpi', name: 'ic_launcher_foreground.png', size: 216, round: false, fg: true },

  { dir: 'android/app/src/main/res/mipmap-xxhdpi', name: 'ic_launcher.png', size: 144, round: false, fg: false },
  { dir: 'android/app/src/main/res/mipmap-xxhdpi', name: 'ic_launcher_round.png', size: 144, round: true, fg: false },
  { dir: 'android/app/src/main/res/mipmap-xxhdpi', name: 'ic_launcher_foreground.png', size: 324, round: false, fg: true },

  { dir: 'android/app/src/main/res/mipmap-xxxhdpi', name: 'ic_launcher.png', size: 192, round: false, fg: false },
  { dir: 'android/app/src/main/res/mipmap-xxxhdpi', name: 'ic_launcher_round.png', size: 192, round: true, fg: false },
  { dir: 'android/app/src/main/res/mipmap-xxxhdpi', name: 'ic_launcher_foreground.png', size: 432, round: false, fg: true },

  // Public web icons
  { dir: 'public', name: 'icon.png', size: 192, round: false, fg: false },
  { dir: 'public', name: 'apple-touch-icon.png', size: 180, round: false, fg: false },
  { dir: 'public', name: 'favicon.ico', size: 48, round: false, fg: false }
];

const baseDir = path.resolve(__dirname, '..');

for (const t of targets) {
  const fullDir = path.join(baseDir, t.dir);
  if (!fs.existsSync(fullDir)) {
    fs.mkdirSync(fullDir, { recursive: true });
  }
  const filePath = path.join(fullDir, t.name);
  const buffer = createValoraIcon(t.size, t.round, t.fg);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${t.dir}/${t.name} (${t.size}x${t.size})`);
}

console.log('✓ All Android & Web App Icons successfully generated!');
