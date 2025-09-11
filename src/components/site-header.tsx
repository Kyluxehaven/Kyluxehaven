
"use client";

import Link from 'next/link';
import { ShoppingCart, Search, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from './cart-sheet';
import { useState, useEffect } from 'react';
import Logo from './logo';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthDialog } from './auth-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from '@/components/ui/skeleton';

export default function SiteHeader() {
  const { cartCount } = useCart();
  const { user, signOutUser } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/');
  }
  
  const getInitials = (nameOrEmail: string | null | undefined) => {
    if (!nameOrEmail) return 'U';
    
    const nameParts = nameOrEmail.split(' ');
    if (nameParts.length > 1 && nameParts[0] && nameParts[1]) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    
    return nameOrEmail.charAt(0).toUpperCase();
  }

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex-1 flex justify-center px-4">
            <form onSubmit={handleSearchSubmit} className="w-full max-w-md relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </form>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
              <Link href="/shop" className="text-foreground/80 hover:text-foreground transition-colors">Shop</Link>
              <Link href="/my-orders" className="text-foreground/80 hover:text-foreground transition-colors">My Orders</Link>
            </nav>
             <div className="relative">
              <Button aria-label={`Open cart with ${cartCount} items`} variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {isClient && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </div>
            {!isClient ? (
                <Skeleton className="h-8 w-20" />
            ) : user ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                      <AvatarFallback>{getInitials(user.displayName ?? user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName ?? 'My Account'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   <DropdownMenuItem asChild>
                       <Link href="/my-orders"><Package className="mr-2 h-4 w-4" />My Orders</Link>
                    </DropdownMenuItem>
                  {user.uid === 'O0dGhZynNgYa6eeZ3r5UDQvRU6h2' && (
                    <DropdownMenuItem asChild>
                       <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Button onClick={() => setIsAuthDialogOpen(true)} variant="outline">
                    Sign In
                </Button>
            )}
          </div>
        </div>
      </div>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </header>
  );
}
