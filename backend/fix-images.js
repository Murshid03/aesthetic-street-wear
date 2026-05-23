/**
 * fix-images.js — One-time migration script
 *
 * Finds all products whose image URL starts with "/uploads/" (a local disk path
 * that is unreachable on Vercel) and replaces it with a sensible Unsplash
 * placeholder image matching the product category.
 *
 * Run once from the backend directory:
 *   node fix-images.js
 *
 * After running, go to Admin → Products and re-upload the real images.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const CATEGORY_PLACEHOLDERS = {
  'Shirts':      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80',
  'T-Shirts':    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80',
  'Pants':       'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&q=80',
};

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80';

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('❌  MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB');

  const Product = (await import('./src/models/Product.js')).default;
  const Settings = (await import('./src/models/Settings.js')).default;

  // ── Fix products ────────────────────────────────────────────────────────────
  const brokenProducts = await Product.find({
    image: { $regex: '^/uploads/' }
  });

  console.log(`\n🔍  Found ${brokenProducts.length} product(s) with broken /uploads/ image URLs`);

  for (const product of brokenProducts) {
    const placeholder = CATEGORY_PLACEHOLDERS[product.category] || DEFAULT_PLACEHOLDER;
    console.log(`  • [${product.category}] "${product.name}"`);
    console.log(`    OLD: ${product.image}`);
    console.log(`    NEW: ${placeholder}`);
    product.image = placeholder;
    await product.save();
  }

  // ── Fix settings hero images ─────────────────────────────────────────────
  const settings = await Settings.findOne();
  if (settings) {
    let settingsChanged = false;
    for (const field of ['heroImage1', 'heroImage2', 'heroImage3']) {
      const val = settings[field];
      if (val && !val.startsWith('http')) {
        console.log(`\n  ⚙️  Settings.${field}: "${val}" → clearing (will use default)`);
        settings[field] = '';
        settingsChanged = true;
      }
    }
    if (settingsChanged) await settings.save();
  }

  console.log('\n✅  Migration complete. Re-upload product images via Admin → Products.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('❌  Migration failed:', err);
  process.exit(1);
});
