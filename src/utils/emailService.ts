import nodemailer from 'nodemailer';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

type TOrderEmailData = {
    customerEmail: string;
    orderNumber: string;
    items: {
        productName: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    deliveryCharge: number;
    subTotal: number;
    trackingLink: string;
};

export const sendOrderConfirmationEmail = async (orderData: TOrderEmailData) => {
    const itemsList = orderData.items
        .map(
            item =>
                `- ${item.productName} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
        )
        .join('\n');

    const emailContent = `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order! Here are your order details:</p>
    
    <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
    
    <h3>Items:</h3>
    <pre>${itemsList}</pre>
    
    <p><strong>Total Amount:</strong> BDT. ${orderData.totalAmount.toFixed(2)}</p>

    <p><strong>Delivery Charge:</strong> BDT. ${orderData.deliveryCharge.toFixed(2)}</p>

    <p><strong>Sub Total:</strong> BDT. ${orderData.subTotal.toFixed(2)}</p>

    <p><strong>Tracking Link:</strong> <a href="${orderData.trackingLink}">${orderData.trackingLink}</a></p>
    
    <p>If you have any questions about your order, please contact our support team.</p>
  `;

    await transporter.sendMail({
        from: process.env.SMTP_FROM_ADDRESS,
        to: orderData.customerEmail,
        subject: `Order Confirmation #${orderData.orderNumber}`,
        html: emailContent,
    });
};