import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
        discountAmount: { type: Number, required: true },
        minPurchaseAmount: { type: Number, default: 0 },
        expiryDate: { type: Date, required: true },
        usageLimit: { type: Number, default: null }, // null means unlimited
        usageCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model('Coupon', couponSchema);
