import express from 'express';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/email.js';

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
        const { status, adminNotes, trackingId } = req.body;
        const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status, adminNotes, trackingId, updatedAt: new Date() },
            { new: true }
        ).populate('user', 'name email');

        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Generate clear and professional status messages
        let personalizedMsg = '';
        switch (status) {
            case 'Confirmed':
                personalizedMsg = `Your order has been confirmed! We are now preparing your items for shipment and will notify you once they are on the way.`;
                break;
            case 'Shipped':
                personalizedMsg = `Great news! Your order has been shipped and is on its way to you.\n\n${trackingId ? `📦 Tracking Number: ${trackingId}` : 'You will receive another update with tracking information shortly.'}`;
                break;
            case 'Delivered':
                personalizedMsg = `Your order has been delivered! We hope you are happy with your new clothes. If you have any feedback, please feel free to reply to this email or tag us on social media!`;
                break;
            case 'Cancelled':
                personalizedMsg = `Your order has been cancelled. ${adminNotes ? `Reason for cancellation: ${adminNotes}` : 'If you have any questions regarding this cancellation, please contact our support team.'}`;
                break;
            default:
                personalizedMsg = `The status of your order has been updated to: ${status}.`;
        }

        const itemSummary = order.items.map(item =>
            `- ${item.name} (${item.size}) x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
        ).join('\n');

        const fullMsg = `Hi ${order.user.name || 'Valued Customer'},

${personalizedMsg}

Order Details:
Order ID: #${order._id.toString().slice(-8).toUpperCase()}
Status: ${status}

Items Purchased:
${itemSummary}

Order Summary:
Total Amount: ₹${order.totalAmount.toLocaleString('en-IN')}
Shipping Address: ${order.deliveryAddress || 'N/A'}

${(status !== 'Shipped' && status !== 'Cancelled' && adminNotes) ? `Note from Store: ${adminNotes}\n` : ""}

Thank you for shopping with us!
- Aesthetic Street Wear Team
`;

        // CREATE NOTIFICATION for user (App notification)
        const appNotificationMsg = `Your order #${order._id.toString().slice(-8).toUpperCase()} has been ${status.toLowerCase()}.`;
        await Notification.create({
            user: order.user._id,
            title: `📦 Order ${status}`,
            message: appNotificationMsg + (adminNotes ? ` Note: ${adminNotes}` : ''),
            type: 'order_status',
            relatedId: order._id.toString()
        });

        // SEND EMAIL NOTIFICATION
        if (order.user && order.user.email) {
            try {
                await sendEmail({
                    email: order.user.email,
                    subject: `Update on your Order #${order._id.toString().slice(-8).toUpperCase()}`,
                    message: fullMsg
                });
                console.log(`📧 Status email sent to ${order.user.email}`);
            } catch (emailErr) {
                console.error('❌ Failed to send status email:', emailErr);
            }
        }

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
