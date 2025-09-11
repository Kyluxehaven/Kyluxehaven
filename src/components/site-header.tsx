"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from './cart-sheet';
import { useState } from 'react';

export default function SiteHeader() {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-headline font-bold text-primary">
              KyluxeHaven
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
              <Link href="/admin" className="text-foreground/80 hover:text-foreground transition-colors">Admin</Link>
            </nav>
            <div className="relative">
              <Button aria-label={`Open cart with ${cartCount} items`} variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
}
