import { type SummarizeOrderInput } from '@/ai/flows/order-summarization';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';
import OrderSummary from './order-summary';

export default function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const orderDataString = searchParams.orderData as string;
  
  if (!orderDataString) {
      return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h1 className="text-2xl font-bold">Invalid Order</h1>
              <p>Could not find order details.</p>
          </div>
      )
  }

  let orderData: SummarizeOrderInput;
  try {
    orderData = JSON.parse(orderDataString);
  } catch (error) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-2xl font-bold">Invalid Order Data</h1>
            <p>Could not read order details.</p>
        </div>
    )
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
            Your order summary is below. A confirmation receipt has also been sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono">{params.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span>{orderData.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping To</span>
              <span className="text-right">{orderData.shippingAddress}</span>
            </div>
          </div>
          <Separator className="my-6" />
          <h3 className="text-lg font-semibold mb-4">AI Generated Summary</h3>
          <OrderSummary orderData={orderData} />
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">This is a demo order. No payment has been processed.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
