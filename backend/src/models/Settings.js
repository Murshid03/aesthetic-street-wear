import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
    {
        shopName: { type: String, default: 'Aesthetic Street Wear' },
        whatsappNumber: { type: String, default: '7540096446' },
        description: { type: String, default: 'Modern luxury streetwear for men' },
        bannerMessage: { type: String, default: 'Free shipping on orders above ₹999!' },
        email: { type: String, default: 'hello@aesthetic.com' },
        address: { type: String, default: '' },
        instagram: { type: String, default: '' },
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
    },
    { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
