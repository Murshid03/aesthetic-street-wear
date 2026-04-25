const testTemplates = () => {
    const user = { name: 'Alex Rivera' };
    const order = {
        _id: '6629ec51a50d0fbb40bc3854',
        items: [{ name: 'Graffiti Hoodie', size: 'L', quantity: 1, price: 2999 }],
        totalAmount: 2999,
        deliveryAddress: 'Bay Area, California'
    };

    const statuses = ['Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    statuses.forEach(status => {
        const adminNotes = status === 'Shipped' ? 'TRACK123456789' : (status === 'Cancelled' ? 'Out of stock' : '');

        let personalizedMsg = '';
        switch (status) {
            case 'Confirmed':
                personalizedMsg = `Your order has been confirmed! We are now preparing your items for shipment and will notify you once they are on the way.`;
                break;
            case 'Shipped':
                personalizedMsg = `Great news! Your order has been shipped and is on its way to you.\n\n📦 Tracking Number: ${adminNotes || 'available soon'}`;
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

        const fullMsg = `Hi ${user.name || 'Valued Customer'},

${personalizedMsg}

Order Details:
Order ID: #${order._id.slice(-8).toUpperCase()}
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
        console.log(`\n=== STATUS: ${status} ===`);
        console.log(fullMsg);
        console.log('==========================');
    });
};

testTemplates();
