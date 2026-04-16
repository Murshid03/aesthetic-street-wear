import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        category: {
            type: String,
            required: true,
            enum: ['Shirts', 'T-Shirts', 'Pants', 'Accessories'],
        },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        image: { type: String, default: '' },
        stockQuantity: { type: Number, required: true, default: 0, min: 0 },
        sizes: [{ type: String }],
        isSoldOut: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model('Product', productSchema);
