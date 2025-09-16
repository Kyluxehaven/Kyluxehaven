
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrdersForUser } from "@/lib/firestore";
import { permanentlyDeleteOrder } from "@/app/admin/actions";
import type { Order } from "@/lib/types";
import { Loader2, Package, MoreHorizontal, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      setIsLoading(true);
      try {
        const userOrders = await getOrdersForUser(user.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch your orders.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (authLoading) return;

    if (!user) {
      router.push("/login");
    } else {
      fetchOrders();
    }
  }, [user, authLoading, router, toast]);

  const openDeleteDialog = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (orderToDelete) {
        setIsLoading(true);
      try {
        await permanentlyDeleteOrder(orderToDelete.id);
        toast({ title: "Order deleted successfully" });
        const updatedOrders = orders.filter(o => o.id !== orderToDelete.id);
        setOrders(updatedOrders);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error deleting order",
          description: "Could not delete the order. Please try again.",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setOrderToDelete(null);
        setIsLoading(false);
      }
    }
  };


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
              <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                <div className="flex-1 flex items-center gap-4 text-left">
                   <div className="flex-1">
                     <p className="font-semibold text-sm sm:text-base">Order ID</p>
                     <p className="font-mono text-xs sm:text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">{order.id}</p>
                     <p className="sm:hidden text-xs text-muted-foreground mt-1">
                        {format(new Date(order.createdAt), 'PP')}
                     </p>
                   </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 ml-2">
                    <p className="font-semibold hidden sm:block">₦{order.totalAmount.toFixed(2)}</p>
                    <Badge variant={order.status === 'Approved' ? 'default' : 'secondary'} className="text-xs">{order.status}</Badge>
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
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <MoreHorizontal className="h-4 w-4 mr-2"/>
                                    Actions
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
                                    onSelect={() => openDeleteDialog(order)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Order
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this order from your history.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
