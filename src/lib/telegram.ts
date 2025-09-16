
import axios from 'axios';
import type { OrderItem } from './types';
import FormData from 'form-data';

interface OrderData {
    customerName: string;
    shippingAddress: string;
    phone: string;
    cartItems: OrderItem[];
    cartTotal: number;
}

export async function sendTelegramNotification(orderData: OrderData) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Telegram bot token or chat ID is not configured.');
        return;
    }

    const itemsSummary = orderData.cartItems.map(item => 
        `- ${item.name} (Qty: ${item.quantity}) - ₦${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `
*New Shipping Information from KyluxeHaven*

A new order has been placed.

*Customer Details:*
- *Name:* ${orderData.customerName}
- *Phone:* ${orderData.phone}
- *Shipping Address:* ${orderData.shippingAddress}

*Order Summary:*
${itemsSummary}

*Total Amount:* ₦${orderData.cartTotal.toFixed(2)}
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
        });
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
        // We don't re-throw the error, as failing to send a notification
        // should not prevent the order from being placed.
    }
}

export async function sendPaymentProofNotification(orderId: string, proofAsDataUrl: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Telegram bot token or chat ID is not configured for payment proof.');
        return;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;

    try {
        // Extract content type and base64 data from the data URL
        const parts = proofAsDataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!parts) {
            throw new Error("Invalid Data URL format for payment proof.");
        }
        const mimeType = parts[1];
        const base64Data = parts[2];
        const imageBuffer = Buffer.from(base64Data, 'base64');

        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('photo', imageBuffer, {
            filename: `${orderId}.jpg`,
            contentType: mimeType,
        });
        form.append('caption', `*New Payment Proof Submitted*\n\n*Order ID:* \`${orderId}\``);
        form.append('parse_mode', 'Markdown');
        
        await axios.post(url, form, {
            headers: form.getHeaders(),
        });
    } catch (error) {
         console.error('Failed to send Telegram payment proof notification:', error);
         // Do not re-throw, as this is a non-critical background task
    }
}
