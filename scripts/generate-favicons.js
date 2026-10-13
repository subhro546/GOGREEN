const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const rootDir = path.resolve(__dirname, '..');
  const logoPath = path.join(rootDir, 'public', 'logo.png');

  if (!fs.existsSync(logoPath)) {
    console.error('Logo file not found at:', logoPath);
    process.exit(1);
  }

  console.log('Generating GoGreen Nursery favicon and branding assets from:', logoPath);

  // 1. Trim transparent padding from logo for maximum clarity in small tab icons
  const trimmedBuffer = await sharp(logoPath).trim().toBuffer();

  // Helper to create a padded square icon with transparent background
  async function createSquareIcon(size, paddingPercent = 0.06) {
    const pad = Math.max(1, Math.round(size * paddingPercent));
    const innerSize = Math.max(1, size - pad * 2);

    return sharp(trimmedBuffer)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .extend({
        top: pad,
        bottom: pad,
        left: pad,
        right: pad,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer();
  }

  // 2. Generate PNG images for standard sizes
  const [png16, png32, png48, png180, png192, png512] = await Promise.all([
    createSquareIcon(16, 0.04),
    createSquareIcon(32, 0.05),
    createSquareIcon(48, 0.05),
    createSquareIcon(180, 0.06), // Apple Touch Icon (180x180)
    createSquareIcon(192, 0.06), // Android / PWA standard
    createSquareIcon(512, 0.06), // High-res PWA / Web App Manifest
  ]);

  // 3. Assemble Windows ICO buffer containing 16x16, 32x32, 48x48 PNG streams
  const icoSizes = [
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 },
  ];

  const numImages = icoSizes.length;
  const headerLen = 6 + numImages * 16;
  let offset = headerLen;

  const icoHeader = Buffer.alloc(headerLen);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type: 1 = ICO
  icoHeader.writeUInt16LE(numImages, 4); // Count of images

  for (let i = 0; i < numImages; i++) {
    const { size, buffer } = icoSizes[i];
    const entryOffset = 6 + i * 16;
    icoHeader.writeUInt8(size >= 256 ? 0 : size, entryOffset);     // Width
    icoHeader.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1); // Height
    icoHeader.writeUInt8(0, entryOffset + 2); // Color palette
    icoHeader.writeUInt8(0, entryOffset + 3); // Reserved
    icoHeader.writeUInt16LE(1, entryOffset + 4); // Color planes
    icoHeader.writeUInt16LE(32, entryOffset + 6); // Bits per pixel (32-bit RGBA)
    icoHeader.writeUInt32LE(buffer.length, entryOffset + 8); // Size of image data
    icoHeader.writeUInt32LE(offset, entryOffset + 12); // Offset to image data
    offset += buffer.length;
  }

  const icoBuffer = Buffer.concat([icoHeader, ...icoSizes.map((img) => img.buffer)]);

  // 4. Write targets
  const outputs = [
    // Next.js App Router root icon files
    { path: path.join(rootDir, 'src', 'app', 'favicon.ico'), buffer: icoBuffer, label: 'src/app/favicon.ico' },
    { path: path.join(rootDir, 'src', 'app', 'icon.png'), buffer: png32, label: 'src/app/icon.png (32x32)' },
    { path: path.join(rootDir, 'src', 'app', 'apple-icon.png'), buffer: png180, label: 'src/app/apple-icon.png (180x180)' },

    // Public folder static fallbacks
    { path: path.join(rootDir, 'public', 'favicon.ico'), buffer: icoBuffer, label: 'public/favicon.ico' },
    { path: path.join(rootDir, 'public', 'icon.png'), buffer: png32, label: 'public/icon.png (32x32)' },
    { path: path.join(rootDir, 'public', 'apple-touch-icon.png'), buffer: png180, label: 'public/apple-touch-icon.png (180x180)' },
    { path: path.join(rootDir, 'public', 'icon-192.png'), buffer: png192, label: 'public/icon-192.png (192x192)' },
    { path: path.join(rootDir, 'public', 'icon-512.png'), buffer: png512, label: 'public/icon-512.png (512x512)' },
  ];

  for (const out of outputs) {
    fs.writeFileSync(out.path, out.buffer);
    console.log(`✓ Generated ${out.label} (${out.buffer.length} bytes)`);
  }

  console.log('Successfully generated all GoGreen Nursery favicon and branding icon assets!');
}

generateFavicons().catch((err) => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
