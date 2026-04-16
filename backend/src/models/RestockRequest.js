import mongoose from 'mongoose';

const restockRequestSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    },
    { timestamps: true }
);

// Ensure a user can only request notification once per product
restockRequestSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model('RestockRequest', restockRequestSchema);
