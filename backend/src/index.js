import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDB } from './seed.js';
import Product from './models/Product.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Seed if empty
const startServer = async () => {
    await connectDB();

    // Check if seeding is needed
    // Check if seeding is needed
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
        console.log('📦 Products missing, seeding initial catalog...');
        await seedDB(false);
    } else {
        // Ensure admin and settings still exist if products are already present
        const User = (await import('./models/User.js')).default;
        const Settings = (await import('./models/Settings.js')).default;

        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            await User.create({
                name: 'Admin',
                email: 'admin@aesthetic.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('✅ Admin user restored: admin@aesthetic.com');
        }

        const settings = await Settings.findOne();
        if (!settings) {
            await Settings.create({});
            console.log('✅ Default settings restored');
        }
    }
};

startServer();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Aesthetic Street Wear API is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
