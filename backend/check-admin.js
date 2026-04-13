import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aesthetic-street-wear');
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
            console.log('✅ Admin found:', admin.email);
        } else {
            console.log('❌ Admin NOT found');
        }
        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkAdmin();
