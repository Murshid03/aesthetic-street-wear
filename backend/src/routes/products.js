import express from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products — List all active products (optionally filter by category)
router.get('/', async (req, res) => {
    try {
        const filter = { isActive: true };
        if (req.query.category) filter.category = req.query.category;
        if (req.query.all === 'true') delete filter.isActive; // admin: show all

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/products — Admin only
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/products/:id — Admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/products/:id — Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/products/seed — Seed sample products (Dev only)
router.post('/seed/sample', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        if (count > 0) return res.json({ message: `Already have ${count} products` });

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

        await Product.insertMany(samples);
        res.json({ message: `Seeded ${samples.length} products` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
