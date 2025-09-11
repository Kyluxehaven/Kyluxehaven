import { db, storage } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Product } from './types';

const productsCollection = collection(db, 'products');

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

export async function getProducts(): Promise<Product[]> {
  const q = query(productsCollection, orderBy('name'));
  let snapshot = await getDocs(q);

  if (snapshot.empty) {
    // Seed the database with initial products
    const seedPromises = initialProducts.map(product => {
        return addDoc(productsCollection, product);
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

export async function updateProduct(id: string, product: Partial<Omit<Product, 'id'>>): Promise<void> {
  const productDoc = doc(db, 'products', id);
  await updateDoc(productDoc, product);
}

export async function deleteProduct(id: string): Promise<void> {
  const productDoc = doc(db, 'products', id);
  await deleteDoc(productDoc);
}
