"use server";

import { redirect } from 'next/navigation';
import type { CartItem, Order } from '@/lib/types';
import { createOrder, uploadPaymentProof, updateOrder } from '@/lib/firestore';

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


async function fileToDataUrl(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    return `data:${file.type};base64,${base64}`;
}

export async function confirmPayment(orderId: string, formData: FormData) {
    const proofFile = formData.get('paymentProof') as File;

    if (!proofFile) {
        throw new Error("Payment proof is required.");
    }
    
    // 1. Convert file to a Base64 Data URL string
    const proofDataUrl = await fileToDataUrl(proofFile);

    // 2. "Upload" the proof (which is now just a string)
    const proofUrl = await uploadPaymentProof(proofDataUrl);

    // 3. Update order with the proof Data URL
    await updateOrder(orderId, { paymentProofUrl: proofUrl });
    
    // 4. Redirect to order confirmation page
    redirect(`/order/${orderId}`);
}
