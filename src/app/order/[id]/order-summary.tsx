import { type Order, type FirestoreOrder, type CartItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Image from 'next/image';


async function getOrderData(orderId: string): Promise<Order | null> {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) {
        return null;
    }
    const firestoreOrder = { id: orderSnap.id, ...orderSnap.data() } as FirestoreOrder;

    // Serialize the Timestamp to a string
    return {
        ...firestoreOrder,
        createdAt: firestoreOrder.createdAt.toDate().toISOString(),
    };
}


export default async function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const orderData = await getOrderData(params.id);

  if (!orderData) {
      notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full h-16 w-16 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-headline mt-4">Thank you for your order!</CardTitle>
          <CardDescription>
            Your order has been placed successfully. Here is a summary of your purchase.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              {orderData.orderItems.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
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
            <Separator className="my-6" />
            <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>₦{orderData.totalAmount.toFixed(2)}</p>
            </div>
            {orderData.status === 'Pending' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-4">
                    <AlertCircle className="h-5 w-5 text-yellow-500"/>
                    <div className="text-sm text-yellow-800">
                        <h4 className="font-semibold">Awaiting Payment Confirmation</h4>
                        <p>Your order is currently pending. We will process it as soon as we confirm your payment. This may take up to 24 hours.</p>
                    </div>
                </div>
            )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Separator className="mb-4" />
            <div className="w-full flex justify-between items-center">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm">{orderData.id}</span>
            </div>
             <div className="w-full flex justify-between items-center">
              <span className="text-muted-foreground">Order Date</span>
              <span>{format(new Date(orderData.createdAt), 'PPP')}</span>
            </div>
            <div className="w-full flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={orderData.status === 'Approved' ? 'default' : 'secondary'}>{orderData.status}</Badge>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}