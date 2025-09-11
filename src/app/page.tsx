import Image from 'next/image';
import { getProducts } from '@/lib/firestore';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Product } from '@/lib/types';

export default async function Home() {
  const products: Product[] = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      <section className="relative bg-card text-card-foreground py-20 md:py-32">
        <div className="absolute inset-0">
            <Image
                src="https://picsum.photos/seed/hero-bg/1920/1080"
                alt="Elegant accessories on display"
                fill
                className="object-cover"
                data-ai-hint="elegant accessories"
                priority
            />
            <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl text-center mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-extrabold text-white">
              Discover Your Signature Style
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200">
              Explore our curated collection of fine accessories. Quality craftsmanship, timeless design.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/shop">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
