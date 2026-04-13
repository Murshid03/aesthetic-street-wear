import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    image: { type: String },
});

const orderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        customerName: { type: String, required: true },
        customerEmail: { type: String, required: true },
        customerPhone: { type: String },
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            pincode: String,
        },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        adminNotes: { type: String, default: '' },
        paymentMethod: { type: String, default: 'COD' },
        paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    },
    { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
