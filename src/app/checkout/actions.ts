
"use server";

import { redirect } from 'next/navigation';
import { createOrder, uploadPaymentProof, updateOrder } from '@/lib/firestore';
import type { OrderItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';

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
    
    revalidatePath('/');
    redirect(`/payment?orderId=${newOrder.id}`);

  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
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
    
    try {
        const proofDataUrl = await fileToDataUrl(proofFile);
        const proofUrl = await uploadPaymentProof(proofDataUrl);
        await updateOrder(orderId, { paymentProofUrl: proofUrl });
        
        revalidatePath('/');
        redirect(`/order/${orderId}`);

    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
          throw error;
        }
        console.error('Payment confirmation failed:', error);
        return {
          error: 'Could not submit your payment proof. Please try again.',
        };
    }
}
