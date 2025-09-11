import type { Product } from './types';

// This file is kept for structural consistency, but the initial product data
// and fetching logic are now handled directly in `lib/firestore.ts` to
// prevent circular dependencies.

export const initialProducts: Product[] = [];
