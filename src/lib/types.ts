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
    createdAt: Timestamp;
    paymentProofUrl?: string; // This can now be a long Data URL string
}
