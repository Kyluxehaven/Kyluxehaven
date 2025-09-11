import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Logo from './logo';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">Your destination for modern style accessories.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
            <div>
              <h3 className="font-semibold tracking-wider uppercase">Shop</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-sm hover:underline">New Arrivals</Link></li>
                <li><Link href="#" className="text-sm hover:underline">Best Sellers</Link></li>
                <li><Link href="#products" className="text-sm hover:underline">All Products</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-sm hover:underline">Contact Us</Link></li>
                <li><Link href="#" className="text-sm hover:underline">FAQ</Link></li>
                <li><Link href="#" className="text-sm hover:underline">Shipping & Returns</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold tracking-wider uppercase">Follow Us</h3>
              <div className="flex gap-4 mt-4">
                <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground"><Facebook size={20} /></Link>
                <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground"><Twitter size={20} /></Link>
                <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground"><Instagram size={20} /></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 KyLuxeHaven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
