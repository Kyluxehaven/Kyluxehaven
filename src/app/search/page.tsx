import { getProducts } from '@/lib/firestore';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { SearchX } from 'lucide-react';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = (searchParams.q as string) || '';
  const allProducts: Product[] = await getProducts();

  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {query ? (
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-center mb-12">
            Search results for "{query}"
          </h1>
        ) : (
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-center mb-12">
            Search All Products
          </h1>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <SearchX className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No products found</h2>
            <p className="mt-2 text-muted-foreground">
              We couldn't find any products matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
