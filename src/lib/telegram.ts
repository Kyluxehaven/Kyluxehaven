
import axios from 'axios';
import type { OrderItem } from './types';

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
