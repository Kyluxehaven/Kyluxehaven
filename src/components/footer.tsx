import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Logo from './logo';

const TikTokIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.73-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.1 2.19-.66 2.77-1.61.19-.33.3-.69.39-1.07.25-1.08.17-2.28-.21-3.32-1.21-3.33-4.35-5.59-7.9-5.06Z"/>
    </svg>
);


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
                <li><Link href="/shop" className="text-sm hover:underline">All Products</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/contact" className="text-sm hover:underline">Contact Us</Link></li>
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
                <Link href="#" aria-label="TikTok" className="text-muted-foreground hover:text-foreground"><TikTokIcon /></Link>
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
