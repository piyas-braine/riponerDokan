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
      item => `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.productName}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">BDT ${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `
    )
    .join('');

  const emailContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #007BFF;">Order Confirmation</h2>
            <p style="text-align: center; font-size: 16px;">Thank you for your order! Below are your order details:</p>
        
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
            <p style="font-size: 16px;"><strong>Order Number:</strong> <span style="color: #007BFF;">${orderData.orderNumber}</span></p>
        
            <h3 style="color: #333; margin-top: 20px;">Items:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #007BFF; color: #fff; text-align: left;">
                  <th style="padding: 10px; border: 1px solid #ddd;">Item</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
        
            <div style="margin-top: 20px;">
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>Sub Total:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">BDT ${orderData.subTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>Delivery Charge:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">BDT ${orderData.deliveryCharge.toFixed(2)}</td>
                </tr>
                <tr style="background-color: #f1f1f1;">
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Amount (Amount to Pay):</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>BDT ${orderData.totalAmount.toFixed(2)}</strong></td>
                </tr>
              </table>
            </div>
        
            <p style="font-size: 16px; margin-top: 20px;">
              <strong>Tracking Link:</strong> 
              <a href="${orderData.trackingLink}" style="color: #007BFF;">Track Your Order</a>
            </p>
        
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
            <p style="text-align: center; font-size: 14px; color: #555;">If you have any questions about your order, please <a href="mailto:support@yourcompany.com" style="color: #007BFF;">contact our support team</a>.</p>
            <p style="text-align: center; font-size: 14px; color: #555;">Thank you for shopping with us!</p>
          </div>
        </div>
    `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM_ADDRESS,
    to: orderData.customerEmail,
    subject: `Order Confirmation #${orderData.orderNumber}`,
    html: emailContent,
  });
};