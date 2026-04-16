import express from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import Notification from '../models/Notification.js';
import RestockRequest from '../models/RestockRequest.js';

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
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
    try {
        console.log('--- Product POST request ---');
        console.log('Body:', req.body);
        console.log('File:', req.file);
        const productData = { ...req.body };

        // Handle sizes if sent as a string (common in multipart/form-data)
        if (typeof productData.sizes === 'string') {
            try {
                productData.sizes = JSON.parse(productData.sizes);
            } catch (e) {
                productData.sizes = productData.sizes.split(',').map(s => s.trim());
            }
        }

        if (req.file) {
            productData.image = `/uploads/${req.file.filename}`;
        }

        // Explicit Type Conversion for FormData strings
        if (productData.price) productData.price = Number(productData.price);
        if (productData.stockQuantity) productData.stockQuantity = Number(productData.stockQuantity);
        if (productData.isActive !== undefined) productData.isActive = String(productData.isActive) === 'true';

        const product = await Product.create(productData);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/products/:id — Admin only
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
    try {
        const productData = { ...req.body };

        // Handle sizes if sent as a string
        if (typeof productData.sizes === 'string') {
            try {
                productData.sizes = JSON.parse(productData.sizes);
            } catch (e) {
                productData.sizes = productData.sizes.split(',').map(s => s.trim());
            }
        }

        if (req.file) {
            productData.image = `/uploads/${req.file.filename}`;
        }

        // Explicit Type Conversion for FormData strings
        if (productData.price) productData.price = Number(productData.price);
        if (productData.stockQuantity) productData.stockQuantity = Number(productData.stockQuantity);
        if (productData.isActive !== undefined) productData.isActive = String(productData.isActive) === 'true';
        if (productData.isSoldOut !== undefined) productData.isSoldOut = String(productData.isSoldOut) === 'true';

        const oldProduct = await Product.findById(req.params.id);
        if (!oldProduct) return res.status(404).json({ error: 'Product not found' });

        const product = await Product.findByIdAndUpdate(req.params.id, productData, {
            new: true,
            runValidators: true,
        });

        // NOTIFICATION LOGIC: If product was sold out and now is NOT sold out, notify users
        if (oldProduct.isSoldOut && !product.isSoldOut) {
            const requests = await RestockRequest.find({ product: product._id });
            if (requests.length > 0) {
                const notifications = requests.map(req => ({
                    user: req.user,
                    title: '🎉 Product Restocked!',
                    message: `Great news! "${product.name}" is back in stock and ready to order.`,
                    type: 'restock_alert',
                    relatedId: product._id.toString()
                }));
                await Notification.insertMany(notifications);
                // Clear requests after notifying
                await RestockRequest.deleteMany({ product: product._id });
            }
        }

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/products/:id/toggle-sold-out — Admin only
router.put('/:id/toggle-sold-out', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const wasSoldOut = product.isSoldOut;
        product.isSoldOut = !product.isSoldOut;
        // If restocking, maybe reset stock to something if it was 0? 
        // For now, just toggle the flag as requested.
        await product.save();

        // If it was restocked (wasSoldOut true -> false)
        if (wasSoldOut && !product.isSoldOut) {
            const requests = await RestockRequest.find({ product: product._id });
            if (requests.length > 0) {
                const notifications = requests.map(r => ({
                    user: r.user,
                    title: '🎉 Product Restocked!',
                    message: `Great news! "${product.name}" is back in stock and ready to order.`,
                    type: 'restock_alert',
                    relatedId: product._id.toString()
                }));
                await Notification.insertMany(notifications);
                await RestockRequest.deleteMany({ product: product._id });
            }
        }

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/products/:id/notify-me — Logged in users
router.post('/:id/notify-me', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (!product.isSoldOut) return res.status(400).json({ error: 'Product is already in stock' });

        // Create notification request
        await RestockRequest.findOneAndUpdate(
            { user: req.user._id, product: product._id },
            { user: req.user._id, product: product._id },
            { upsert: true, new: true }
        );

        res.json({ message: 'We will notify you once this product is back in stock!' });
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
            { name: 'Oversized Purple Hoodie', category: 'T-Shirts', description: 'Premium cotton blend oversized hoodie with vibrant purple finish.', price: 1299, image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500', stockQuantity: 50, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { name: 'Oxford Button-Down Shirt', category: 'Shirts', description: 'Classic Oxford weave button-down shirt perfect for any occasion.', price: 1599, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', stockQuantity: 40, sizes: ['S', 'M', 'L', 'XL'] },
            { name: 'Slim Fit Chinos', category: 'Pants', description: 'Modern slim-fit chinos that blend style and comfort seamlessly.', price: 1899, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', stockQuantity: 30, sizes: ['28', '30', '32', '34', '36'] },
            { name: 'Graphic Tee - Urban Print', category: 'T-Shirts', description: 'Bold urban graphic tee made from 100% organic cotton.', price: 799, image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500', stockQuantity: 60, sizes: ['S', 'M', 'L', 'XL'] },
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
