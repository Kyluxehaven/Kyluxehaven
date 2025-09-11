"use client";

import { summarizeOrder, type SummarizeOrderInput, type SummarizeOrderOutput } from '@/ai/flows/order-summarization';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { type Order } from '@/lib/types';

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
      }))
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
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    );
  }

  if (!summary) {
    return <p className="text-destructive">Failed to load order summary.</p>;
  }

  const summaryParagraphs = summary.summary.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      {summaryParagraphs.map((p, i) => <p key={i}>{p}</p>)}
      <p className="font-bold text-foreground !mt-6">Total: ₦{summary.totalAmount.toFixed(2)}</p>
    </div>
  );
}
