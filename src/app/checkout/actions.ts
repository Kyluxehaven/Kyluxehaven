"use server";

import { redirect } from 'next/navigation';
import type { CartItem } from '@/lib/types';

export async function placeOrder(cartItems: CartItem[], customerName: string, shippingAddress: string) {
  // In a real app, you would save the order to a database here.
  // For this demo, we'll generate a random order ID and pass data via URL.

  const orderId = Math.random().toString(36).substr(2, 9);

  const orderData = {
    orderId,
    customerName,
    shippingAddress,
    orderItems: cartItems.map(item => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  const params = new URLSearchParams({
    orderData: JSON.stringify(orderData),
  });

  // Redirect to the new payment page instead of the order confirmation
  redirect(`/payment?${params.toString()}`);
}
