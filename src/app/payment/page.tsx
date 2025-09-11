
"use client";

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Banknote, User, Hash, UploadCloud, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, Suspense } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { confirmPayment } from '../checkout/actions';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const orderId = searchParams.get('orderId');
  const formRef = useRef<HTMLFormElement>(null);

  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>No order ID found. Please try checking out again.</p>
        <Button asChild className="mt-4">
          <Link href="/checkout">Go to Checkout</Link>
        </Button>
      </div>
    );
  }
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB.',
        });
        return;
      }
      setPaymentProof(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleConfirmation = async () => {
    if (!paymentProof) {
      toast({
        variant: 'destructive',
        title: 'Proof of Payment Required',
        description: 'Please upload an image as proof of payment.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
        const formData = new FormData();
        formData.append('paymentProof', paymentProof);
        
        await confirmPayment(orderId, formData);
        
        // On success, the server action will redirect.
        // We only need to handle the case where it throws an error.
        clearCart();

    } catch (error: any) {
        // The `redirect()` function in a server action throws a special `NEXT_REDIRECT` error.
        // We need to catch it and re-throw it to allow the redirect to happen,
        // otherwise it will be treated as a real error.
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
          throw error;
        }

        console.error(error);
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: "Could not submit your payment proof. Please try again."
        });
        setIsSubmitting(false);
    }
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
          <form ref={formRef} className="space-y-2">
            <Label htmlFor="paymentProof">Upload Proof of Payment</Label>
            <div className="flex items-center justify-center w-full">
                <label
                    htmlFor="paymentProof"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/30 hover:bg-secondary/50"
                >
                    {previewUrl ? (
                         <div className="relative w-full h-full">
                            <Image src={previewUrl} alt="Payment proof preview" fill className="object-contain rounded-lg" />
                             <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPaymentProof(null);
                                    setPreviewUrl(null);
                                    const input = document.getElementById('paymentProof') as HTMLInputElement;
                                    if(input) input.value = '';
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                         </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 5MB)</p>
                        </div>
                    )}
                    <Input id="paymentProof" name="paymentProof" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" />
                </label>
            </div> 
          </form>

        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="button" onClick={handleConfirmation} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Confirming...' : 'I Have Paid, Continue'}
          </Button>
          <p className="text-xs text-muted-foreground text-center w-full">By continuing, you are confirming that you have made the payment. Your order summary will be shown next.</p>
        </CardFooter>
      </Card>
    </div>
  );
}


export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
            <PaymentPageContent />
        </Suspense>
    );
}