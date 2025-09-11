"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrdersForUser } from "@/lib/firestore";
import type { Order } from "@/lib/types";
import { Loader2, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    async function fetchOrders() {
      try {
        const userOrders = await getOrdersForUser(user!.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [user, authLoading, router]);

  if (isLoading || authLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-headline font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
            <Package className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-muted-foreground">
              You haven't placed any orders. Let's change that!
            </p>
            <Button asChild className="mt-6">
                <Link href="/shop">Start Shopping</Link>
            </Button>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {orders.map((order) => (
            <AccordionItem key={order.id} value={order.id} className="bg-card border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex-1 flex items-center gap-4 text-left">
                   <div className="flex-1">
                     <p className="font-semibold">Order ID: <span className="font-mono text-sm text-muted-foreground">{order.id}</span></p>
                     <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), 'PPP')}
                     </p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                    <p className="font-semibold hidden sm:block">₦{order.totalAmount.toFixed(2)}</p>
                    <Badge variant={order.status === 'Approved' ? 'default' : 'secondary'}>{order.status}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                 <Separator className="mb-4"/>
                 <h4 className="font-semibold mb-3">Order Details</h4>
                 <div className="space-y-3 mb-4">
                    {order.orderItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-md overflow-hidden border">
                                    <Image src={item.image} alt={item.name} fill className="object-cover"/>
                                </div>
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-medium">₦{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                 </div>
                 <Separator className="my-4"/>
                 <div className="flex justify-end">
                    <div className="text-right">
                        <p className="text-sm">Subtotal: <span className="font-medium">₦{order.totalAmount.toFixed(2)}</span></p>
                        <p className="text-sm">Shipping: <span className="font-medium">Free</span></p>
                        <p className="text-base font-bold mt-1">Total: <span className="font-bold">₦{order.totalAmount.toFixed(2)}</span></p>
                    </div>
                 </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
