#!/usr/bin/env node

import sharp from 'sharp';
import { glob } from 'glob';
import { mkdir, stat } from 'fs/promises';
import path from 'path';

const SOURCE_DIR = 'public/images';
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 75;
const PNG_QUALITY = 80;

async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function getFileSize(filePath) {
  try {
    const stats = await stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function optimizeImage(inputPath) {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath).toLowerCase();
  const baseName = path.basename(inputPath, ext);

  // Skip already optimized files
  if (inputPath.includes('.webp') || inputPath.includes('.avif')) {
    return null;
  }

  const webpPath = path.join(dir, `${baseName}.webp`);
  const avifPath = path.join(dir, `${baseName}.avif`);

  const originalSize = await getFileSize(inputPath);
  const results = {
    original: { path: inputPath, size: originalSize },
    webp: null,
    avif: null,
  };

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Skip if image is too small (likely icons)
    if (metadata.width < 32 || metadata.height < 32) {
      console.log(`Skipping ${inputPath} (too small)`);
      return null;
    }

    // Generate WebP
    await image
      .clone()
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);

    const webpSize = await getFileSize(webpPath);
    results.webp = { path: webpPath, size: webpSize };

    // Generate AVIF
    await image
      .clone()
      .avif({ quality: AVIF_QUALITY })
      .toFile(avifPath);

    const avifSize = await getFileSize(avifPath);
    results.avif = { path: avifPath, size: avifSize };

    // Calculate savings
    const webpSavings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    const avifSavings = ((originalSize - avifSize) / originalSize * 100).toFixed(1);

    console.log(`Optimized: ${inputPath}`);
    console.log(`  Original: ${formatBytes(originalSize)}`);
    console.log(`  WebP: ${formatBytes(webpSize)} (${webpSavings}% smaller)`);
    console.log(`  AVIF: ${formatBytes(avifSize)} (${avifSavings}% smaller)`);

    return results;
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('Starting image optimization...\n');

  // Find all PNG and JPG files
  const patterns = [
    `${SOURCE_DIR}/**/*.png`,
    `${SOURCE_DIR}/**/*.jpg`,
    `${SOURCE_DIR}/**/*.jpeg`,
  ];

  let totalOriginal = 0;
  let totalWebp = 0;
  let totalAvif = 0;
  let processedCount = 0;

  for (const pattern of patterns) {
    const files = await glob(pattern);

    for (const file of files) {
      const result = await optimizeImage(file);
      if (result) {
        totalOriginal += result.original.size;
        if (result.webp) totalWebp += result.webp.size;
        if (result.avif) totalAvif += result.avif.size;
        processedCount++;
      }
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Processed: ${processedCount} images`);
  console.log(`Original total: ${formatBytes(totalOriginal)}`);
  console.log(`WebP total: ${formatBytes(totalWebp)} (${((totalOriginal - totalWebp) / totalOriginal * 100).toFixed(1)}% savings)`);
  console.log(`AVIF total: ${formatBytes(totalAvif)} (${((totalOriginal - totalAvif) / totalOriginal * 100).toFixed(1)}% savings)`);
}

main().catch(console.error);
