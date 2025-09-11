import type { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageHint: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Approved' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
    id: string;
    userId: string;
    customerName: string;
    shippingAddress: string;
    orderItems: CartItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: string; // Changed from Timestamp
    paymentProofUrl?: string; // This can now be a long Data URL string
}

// This type is used when fetching from Firestore before serialization
export interface FirestoreOrder extends Omit<Order, 'createdAt'> {
    createdAt: Timestamp;
}
