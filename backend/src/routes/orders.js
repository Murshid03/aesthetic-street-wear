import express from 'express';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders — Place an order (logged-in users)
router.post('/', protect, async (req, res) => {
    try {
        const { items, shippingAddress, customerName, customerEmail, customerPhone, paymentMethod } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ error: 'No items in order' });

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await Order.create({
            userId: req.user._id.toString(),
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            items,
            totalAmount,
            paymentMethod: paymentMethod || 'COD',
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/orders/my — Current user's orders
router.get('/my', protect, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id.toString() }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/orders — Admin: all orders
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        // Users can only see their own orders
        if (req.user.role !== 'admin' && order.userId !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/orders/:id — Admin: update status/notes
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/orders/:id — Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/orders/stats/summary — Admin dashboard stats
router.get('/stats/summary', protect, adminOnly, async (req, res) => {
    try {
        const [totalOrders, totalRevenue, pendingOrders] = await Promise.all([
            Order.countDocuments(),
            Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
            Order.countDocuments({ status: 'Pending' }),
        ]);
        res.json({
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            pendingOrders,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
