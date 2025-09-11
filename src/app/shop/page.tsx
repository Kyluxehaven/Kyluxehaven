import { getProducts } from '@/lib/firestore';
import ProductCard from '@/components/product-card';
import { Product } from '@/lib/types';

export default async function ShopPage() {
  const products: Product[] = await getProducts();

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-center mb-12">
          All Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
