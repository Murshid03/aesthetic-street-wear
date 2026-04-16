import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: ['order_status', 'restock_alert', 'general'],
            default: 'general'
        },
        relatedId: { type: String }, // Order ID or Product ID
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
