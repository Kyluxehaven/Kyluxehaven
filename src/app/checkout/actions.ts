"use server";

import { redirect } from 'next/navigation';
import type { CartItem, Order } from '@/lib/types';
import { createOrder, uploadPaymentProof } from '@/lib/firestore';

interface OrderData {
    userId: string;
    customerName: string;
    shippingAddress: string;
    cartItems: CartItem[];
    cartTotal: number;
}

export async function placeOrder(orderData: OrderData) {
  // We're creating the order with a 'Pending' status here,
  // before the payment proof is uploaded.
  const newOrder = await createOrder({
    userId: orderData.userId,
    customerName: orderData.customerName,
    shippingAddress: orderData.shippingAddress,
    orderItems: orderData.cartItems,
    totalAmount: orderData.cartTotal,
  });

  // Redirect to the payment page with the new order's ID
  redirect(`/payment?orderId=${newOrder.id}`);
}

export async function confirmPayment(orderId: string, formData: FormData) {
    const proofFile = formData.get('paymentProof') as File;

    if (!proofFile) {
        throw new Error("Payment proof is required.");
    }
    
    // 1. Upload proof to storage
    const proofUrl = await uploadPaymentProof(proofFile);

    // 2. Update order with proof URL
    // We can add more fields to update here if needed in the future
    await updateOrder(orderId, { paymentProofUrl: proofUrl });
    
    // 3. Redirect to order confirmation page
    redirect(`/order/${orderId}`);
}
