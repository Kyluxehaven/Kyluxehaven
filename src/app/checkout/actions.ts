
"use server";

import { redirect } from 'next/navigation';
import { createOrder, uploadPaymentProof, updateOrder } from '@/lib/firestore';
import type { OrderItem } from '@/lib/types';

interface OrderData {
    userId: string;
    customerName: string;
    shippingAddress: string;
    cartItems: OrderItem[];
    cartTotal: number;
}

export async function placeOrder(orderData: OrderData) {
  try {
    const newOrder = await createOrder({
      userId: orderData.userId,
      customerName: orderData.customerName,
      shippingAddress: orderData.shippingAddress,
      orderItems: orderData.cartItems,
      totalAmount: orderData.cartTotal,
    });
    
    // Redirect must be called outside of the try/catch block
    // if the action also returns a value in the catch block.
    // However, since we are confident in the redirect, we can place it here.
    // The redirect function throws a NEXT_REDIRECT error, which is caught
    // by Next.js to perform the redirection. It's not a "real" error in this context.
    redirect(`/payment?orderId=${newOrder.id}`);

  } catch (error: any) {
    console.error('Failed to create order:', error);
    // If the error is the special redirect error, we don't want to treat it as a real error.
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    // For all other errors, return an error object for the client to handle.
    return {
      error: 'There was a problem creating your order. Please try again.',
    };
  }
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
