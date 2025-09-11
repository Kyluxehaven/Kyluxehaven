import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import type { Product } from './types';
import { initialProducts } from './products';

const productsCollection = collection(db, 'products');

export async function getProducts(): Promise<Product[]> {
  const q = query(productsCollection, orderBy('name'));
  let snapshot = await getDocs(q);

  if (snapshot.empty) {
    // Seed the database with initial products
    const seedPromises = initialProducts.map(product => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = product; // Firestore generates the ID
        return addDoc(productsCollection, rest);
    });
    await Promise.all(seedPromises);
    
    // Re-fetch after seeding
    snapshot = await getDocs(q);
  }

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
