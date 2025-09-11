import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import type { Product } from './types';

const productsCollection = collection(db, 'products');

export async function getProducts(): Promise<Product[]> {
  const q = query(productsCollection, orderBy('name'));
  const snapshot = await getDocs(q);
  const products: Product[] = [];
  snapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  const docRef = await addDoc(productsCollection, product);
  return docRef.id;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<void> {
  const productDoc = doc(db, 'products', id);
  await updateDoc(productDoc, product);
}

export async function deleteProduct(id: string): Promise<void> {
  const productDoc = doc(db, 'products', id);
  await deleteDoc(productDoc);
}
