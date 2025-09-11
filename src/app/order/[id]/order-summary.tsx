"use client";

import { summarizeOrder, type SummarizeOrderInput, type SummarizeOrderOutput } from '@/ai/flows/order-summarization';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { type Order } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

export default function OrderSummary({ orderData }: { orderData: Order }) {
  const [summary, setSummary] = useState<SummarizeOrderOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const summarizationInput: SummarizeOrderInput = useMemo(() => ({
      orderId: orderData.id,
      customerName: orderData.customerName,
      shippingAddress: orderData.shippingAddress,
      orderItems: orderData.orderItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
      })),
      totalAmount: orderData.totalAmount,
  }), [orderData]);

  useEffect(() => {
    toast({
      title: "Order Placed Successfully!",
      description: "Your receipt has been sent to your email.",
    });

    async function getSummary() {
      try {
        setLoading(true);
        const result = await summarizeOrder(summarizationInput);
        setSummary(result);
      } catch (e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate order summary.",
        });
      } finally {
        setLoading(false);
      }
    }
    
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summarizationInput]);

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
             <Separator className="my-6" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
             <Separator className="my-6" />
            <div className="flex justify-between font-bold text-lg">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-28" />
            </div>
        </div>
    );
  }

  if (!summary) {
    return <p className="text-destructive">Failed to load order summary.</p>;
  }

  const summaryParagraphs = summary.summary.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="space-y-4">
        {summaryParagraphs.map((p, i) => <p key={i} className="text-sm text-muted-foreground">{p}</p>)}
        <Separator className="my-6" />
        <div className="flex justify-between font-bold text-lg">
            <p>Total</p>
            <p>₦{summary.totalAmount.toFixed(2)}</p>
        </div>
    </div>
  );
}
