
import { db, storage } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where, serverTimestamp, getDoc, Timestamp } from 'firebase/firestore';
import type { Product, Order, OrderItem, FirestoreOrder } from './types';

const productsCollection = collection(db, 'products');
const ordersCollection = collection(db, 'orders');

const initialProducts: Omit<Product, 'id'>[] = [
    {
      name: 'Classic Wristband',
      description: 'A stylish and comfortable wristband for everyday wear.',
      price: 24000,
      image: 'https://picsum.photos/seed/wristband/400/400',
      imageHint: 'wristband fashion',
      category: 'Wristband',
    },
    {
      name: 'Elegant Timepiece',
      description: 'A sophisticated wristwatch that complements any outfit.',
      price: 180750,
      image: 'https://picsum.photos/seed/wristwatch/400/400',
      imageHint: 'wristwatch elegant',
      category: 'Wristwatch',
    },
    {
      name: 'Silver Charm Bracelet',
      description: 'A beautiful silver bracelet with delicate charms.',
      price: 67500,
      image: 'https://picsum.photos/seed/bracelet/400/400',
      imageHint: 'bracelet jewelry',
      category: 'Bracelet',
    },
    {
      name: 'Minimalist Leather Wallet',
      description: 'A sleek wallet made from genuine leather.',
      price: 52500,
      image: 'https://picsum.photos/seed/wallet/400/400',
      imageHint: 'leather wallet',
      category: 'Wallet',
    },
    {
      name: 'Classic Leather Belt',
      description: 'A durable and timeless leather belt.',
      price: 37500,
      image: 'https://picsum.photos/seed/belt/400/400',
      imageHint: 'leather belt',
      category: 'Belt',
    },
    {
      name: 'Urban Explorer Cap',
      description: 'A trendy cap for your urban adventures.',
      price: 34500,
      image: 'https://picsum.photos/seed/cap/400/400',
      imageHint: 'fashion cap',
      category: 'Cap',
    },
    {
      name: 'Diamond Stud Earrings',
      description: 'A pair of sparkling diamond stud earrings.',
      price: 375000,
      image: 'https://picsum.photos/seed/earring/400/400',
      imageHint: 'earrings jewelry',
      category: 'Earring',
    },
    {
      name: 'Shimmering Lip Gloss',
      description: 'A high-shine lip gloss for a luscious look.',
      price: 18000,
      image: 'https://picsum.photos/seed/lipgloss/400/400',
      imageHint: 'lip gloss',
      category: 'Lip glosses',
    },
    {
      name: 'Nourishing Hand Cream',
      description: 'A rich and moisturizing hand cream with a pleasant scent.',
      price: 12750,
      image: 'https://picsum.photos/seed/handcream/400/400',
      imageHint: 'hand cream',
      category: 'Hand cream',
    },
];

// Product Functions
export async function getProducts(): Promise<Product[]> {
  const q = query(productsCollection, orderBy('name'));
  let snapshot = await getDocs(q);

  if (snapshot.empty) {
    const seedPromises = initialProducts.map(product => {
        return addDoc(productsCollection, product);
    });
    await Promise.all(seedPromises);
    snapshot = await getDocs(q);
  }

  const products: Product[] = [];
  snapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
}

// Order Functions
type OrderInput = {
    userId: string;
    customerName: string;
    shippingAddress: string;
    orderItems: OrderItem[];
    totalAmount: number;
}

export async function createOrder(orderData: OrderInput): Promise<FirestoreOrder> {
    const newOrderRef = await addDoc(ordersCollection, {
        ...orderData,
        status: 'Pending',
        createdAt: serverTimestamp(),
        isArchived: false,
    });
    const newOrderSnap = await getDoc(newOrderRef);
    return { id: newOrderSnap.id, ...newOrderSnap.data() } as FirestoreOrder;
}

// This function now just returns the string passed to it.
// The conversion from File to Data URL will happen in the server action.
export async function uploadPaymentProof(proofAsDataUrl: string): Promise<string> {
  return proofAsDataUrl;
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<void> {
    const orderDoc = doc(db, 'orders', id);
    await updateDoc(orderDoc, data);
}

function processOrder(doc: any): Order {
    const data = doc.data() as FirestoreOrder;
    return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
    };
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
    const q = query(
      ordersCollection, 
      where('userId', '==', userId), 
      where('isArchived', '!=', true),
      orderBy('isArchived'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(processOrder);
}

export async function getAllOrders(): Promise<Order[]> {
    const q = query(ordersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(processOrder);
}
