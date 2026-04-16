import express from 'express';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// POST /api/orders — Place an order (logged-in users), starts as Pending
router.post('/', protect, async (req, res) => {
    try {
        const { items, customerName, deliveryAddress } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ error: 'No items in order' });

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await Order.create({
            user: req.user._id,
            customerName: customerName || req.user.name,
            deliveryAddress: deliveryAddress || '',
            items,
            totalAmount,
            status: 'Pending', // Always starts as Pending
            paymentMethod: 'WhatsApp COD',
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/orders/my — Current user's orders (syncs with admin updates)
router.get('/my', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/orders — Admin: all orders with user info
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        // Users can only see their own orders
        if (req.user.role !== 'admin' && order.user?._id?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/orders/:id/status — Admin: update status + notes
router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status, adminNotes, updatedAt: new Date() },
            { new: true }
        ).populate('user', 'name email');

        if (!order) return res.status(404).json({ error: 'Order not found' });

        // CREATE NOTIFICATION for user
        await Notification.create({
            user: order.user._id,
            title: `📦 Order ${status}`,
            message: `Your order #...${order._id.toString().slice(-6).toUpperCase()} has been ${status.toLowerCase()}.${adminNotes ? ` Note: ${adminNotes}` : ''}`,
            type: 'order_status',
            relatedId: order._id.toString()
        });

        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/orders/:id — Admin: generic update (kept for backward compat)
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

export default router;
