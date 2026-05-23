import express from 'express';
import Settings from '../models/Settings.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

// GET /api/settings — Public: get shop settings
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/settings — Admin only: update text-based settings
router.put('/', protect, adminOnly, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            Object.assign(settings, req.body);
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/settings/hero-image — Admin only: upload one hero image
// field = heroImage1 | heroImage2 | heroImage3
router.post('/hero-image', protect, adminOnly, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

        const field = req.body.field; // heroImage1 | heroImage2 | heroImage3
        if (!['heroImage1', 'heroImage2', 'heroImage3'].includes(field)) {
            return res.status(400).json({ error: 'Invalid image field' });
        }

        // Upload to Cloudinary (memory storage — no local disk writes, works on Vercel)
        const imageUrl = await uploadToCloudinary(req.file.buffer, 'aesthetic-streetwear/hero');

        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});
        settings[field] = imageUrl;
        await settings.save();

        res.json({ url: imageUrl, settings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

