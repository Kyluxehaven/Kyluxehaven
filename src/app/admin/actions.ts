
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Product, Order } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'products'), product);
  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/search');
  revalidatePath('/admin');
  return docRef.id;
}

export async function updateProduct(id: string, product: Partial<Omit<Product, 'id'>>): Promise<void> {
  const productDoc = doc(db, 'products', id);
  await updateDoc(productDoc, product);
  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/search');
  revalidatePath('/admin');
}

export async function deleteProduct(id: string): Promise<void> {
  const productDoc = doc(db, 'products', id);
  await deleteDoc(productDoc);
  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/search');
  revalidatePath('/admin');
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<void> {
    const orderDoc = doc(db, 'orders', id);
    await updateDoc(orderDoc, data);
    revalidatePath('/admin');
    revalidatePath('/my-orders');
    revalidatePath(`/order/${id}`);
}

export async function deleteOrder(id: string): Promise<void> {
  const orderDoc = doc(db, 'orders', id);
  await deleteDoc(orderDoc);
  revalidatePath('/admin');
  revalidatePath('/my-orders');
}
