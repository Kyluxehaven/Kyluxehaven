"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Banknote, User, Hash } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderDataString = searchParams.get('orderData');

  if (!orderDataString) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>No order data found. Please try checking out again.</p>
        <Button asChild className="mt-4">
          <Link href="/checkout">Go to Checkout</Link>
        </Button>
      </div>
    );
  }

  const orderData = JSON.parse(orderDataString);
  const orderId = orderData.orderId;
  
  const handleConfirmation = () => {
    // Redirect to the final order confirmation page
    const params = new URLSearchParams({ orderData: orderDataString });
    router.push(`/order/${orderId}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-center">Complete Your Payment</CardTitle>
          <CardDescription className="text-center">
            Please make a bank transfer to the account below to complete your order.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg p-4 space-y-4 bg-secondary/30">
            <div className="flex items-start gap-4">
              <Banknote className="h-6 w-6 text-muted-foreground mt-1" />
              <div>
                <p className="font-semibold text-lg">Zenith Bank</p>
                <p className="text-sm text-muted-foreground">Bank Name</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-4">
              <Hash className="h-6 w-6 text-muted-foreground mt-1" />
              <div>
                <p className="font-semibold text-lg tracking-wider">2271504931</p>
                <p className="text-sm text-muted-foreground">Account Number</p>
              </div>
            </div>
             <Separator />
             <div className="flex items-start gap-4">
              <User className="h-6 w-6 text-muted-foreground mt-1" />
              <div>
                <p className="font-semibold text-lg">Okeakpu princess gift</p>
                <p className="text-sm text-muted-foreground">Account Name</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
              Your order will be processed as soon as your payment is confirmed. Please use your Order ID as the payment reference if possible. Your Order ID is <span className="font-mono font-bold">{orderId}</span>.
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button onClick={handleConfirmation} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            I Have Paid, Continue
          </Button>
          <p className="text-xs text-muted-foreground text-center w-full">By continuing, you are confirming that you have made the payment. Your order summary will be shown next.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
