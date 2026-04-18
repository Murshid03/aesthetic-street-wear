import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

const router = express.Router();

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const cleanEmail = email.trim().toLowerCase();
        const existing = await User.findOne({ email: cleanEmail });
        if (existing) return res.status(400).json({ error: 'User already exists' });

        const user = await User.create({ name, email: cleanEmail, password });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        const cleanEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: cleanEmail });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
    res.json(req.user);
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const cleanEmail = email.trim().toLowerCase();
        console.log(`[AUTH] Forgot password request for: ${cleanEmail}`);

        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            console.log(`[AUTH] User not found: ${cleanEmail}`);
            return res.status(404).json({ error: 'User not found with this email' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();
        console.log(`[AUTH] OTP generated for ${email}: ${otp}`);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP - Aesthetic Street Wear',
                message: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
            });
            console.log(`[AUTH] Email attempt finished for ${email}`);
        } catch (emailErr) {
            console.error(`[AUTH] Email sending failed:`, emailErr);
            // We don't necessarily want to fail the whole request if email fail 
            // but for security we should probably inform the user or log it.
            return res.status(500).json({ error: 'Failed to send recovery email. Please try again later.' });
        }

        res.json({ message: 'OTP sent to email' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ error: 'Invalid or expired OTP' });

        res.json({ message: 'OTP verified successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ error: 'Invalid or expired OTP' });

        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/seed-admin — creates admin if not exists
router.post('/seed-admin', async (req, res) => {
    try {
        const existing = await User.findOne({ role: 'admin' });
        if (existing) return res.json({ message: 'Admin already exists' });

        const admin = await User.create({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL || 'admin@aesthetic.com',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            role: 'admin',
        });
        res.status(201).json({ message: 'Admin created', email: admin.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
