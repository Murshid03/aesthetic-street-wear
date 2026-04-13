import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Settings from './models/Settings.js';

dotenv.config();

const samples = [
    { name: 'Oversized Purple Hoodie', category: 'TShirts', description: 'Premium cotton blend oversized hoodie with vibrant purple finish.', price: 1299, image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500', stockQuantity: 50, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { name: 'Oxford Button-Down Shirt', category: 'Shirts', description: 'Classic Oxford weave button-down shirt perfect for any occasion.', price: 1599, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', stockQuantity: 40, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Slim Fit Chinos', category: 'Pants', description: 'Modern slim-fit chinos that blend style and comfort seamlessly.', price: 1899, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', stockQuantity: 30, sizes: ['28', '30', '32', '34', '36'] },
    { name: 'Graphic Tee - Urban Print', category: 'TShirts', description: 'Bold urban graphic tee made from 100% organic cotton.', price: 799, image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500', stockQuantity: 60, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Leather Belt - Black', category: 'Accessories', description: 'Genuine leather belt with minimalist silver buckle.', price: 599, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', stockQuantity: 80, sizes: ['Free Size'] },
    { name: 'Vintage Denim Jacket', category: 'Shirts', description: 'Distressed vintage denim jacket for that effortlessly cool look.', price: 2999, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', stockQuantity: 20, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Cargo Pants - Olive', category: 'Pants', description: 'Functional cargo pants with multiple pockets and relaxed fit.', price: 2199, image: 'https://images.unsplash.com/photo-1617952237689-fb17f7044f6e?w=500', stockQuantity: 35, sizes: ['28', '30', '32', '34', '36'] },
    { name: 'Minimalist Watch', category: 'Accessories', description: 'Clean-dial minimalist watch with premium mesh strap.', price: 3499, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', stockQuantity: 25, sizes: ['Free Size'] },
];

export const seedDB = async (shouldExit = true) => {
    try {
        // Clear existing
        await Product.deleteMany({});
        console.log('Cleared products.');

        // Add samples
        await Product.insertMany(samples);
        console.log(`Seeded ${samples.length} products.`);

        // Ensure Admin
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@aesthetic.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Created default admin: admin@aesthetic.com / admin123');
        }

        // Default settings
        const settingsExists = await Settings.findOne();
        if (!settingsExists) {
            await Settings.create({});
            console.log('Created default settings.');
        }

        console.log('✅ Seeding complete!');
        if (shouldExit) process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        if (shouldExit) process.exit(1);
    }
};

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aesthetic-street-wear').then(() => {
        seedDB();
    });
}
