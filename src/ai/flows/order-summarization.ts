'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing customer orders.
 *
 * - summarizeOrder - A function that takes order details and returns a summary.
 * - SummarizeOrderInput - The input type for the summarizeOrder function.
 * - SummarizeOrderOutput - The return type for the summarizeOrder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for a single order item
const OrderItemSchema = z.object({
  productId: z.string().describe('The unique identifier for the product.'),
  name: z.string().describe('The name of the product.'),
  quantity: z.number().int().min(1).describe('The quantity of the product ordered.'),
  price: z.number().min(0).describe('The price of the product.'),
});

// Define the input schema for the order summarization flow
const SummarizeOrderInputSchema = z.object({
  orderId: z.string().describe('The unique identifier for the order.'),
  customerName: z.string().describe('The name of the customer.'),
  orderItems: z.array(OrderItemSchema).describe('An array of order items.'),
  shippingAddress: z.string().describe('The shipping address for the order.'),
  totalAmount: z.number().describe("The total amount for the order."),
});
export type SummarizeOrderInput = z.infer<typeof SummarizeOrderInputSchema>;

// Define the output schema for the order summarization flow
const SummarizeOrderOutputSchema = z.string().describe('A detailed summary of the order.');
export type SummarizeOrderOutput = z.infer<typeof SummarizeOrderOutputSchema>;


// Exported function to summarize the order
export async function summarizeOrder(input: SummarizeOrderInput): Promise<SummarizeOrderOutput> {
  return summarizeOrderFlow(input);
}

const summarizeOrderPrompt = ai.definePrompt({
  name: 'summarizeOrderPrompt',
  input: {schema: SummarizeOrderInputSchema},
  output: {schema: SummarizeOrderOutputSchema},
  prompt: `You are an order summarization expert for KyluxeHaven, an e-commerce website.
  Your task is to generate a clear, concise, and accurate summary of a customer's order.
  The currency is Nigerian Naira (₦).
  The summary should include the following:
  - A greeting to the customer by name.
  - A list of all items ordered, including their name, quantity, and price in Naira.
  - The total amount of the order.
  - A thank you message and an estimated delivery date of 3-5 business days.

  Here are the order details:
  Customer Name: {{{customerName}}}
  Order ID: {{{orderId}}}
  Shipping Address: {{{shippingAddress}}}
  Total Amount: ₦{{{totalAmount}}}
  Order Items:
  {{#each orderItems}}
  - Product: {{name}}, Quantity: {{quantity}}, Price: ₦{{price}}
  {{/each}}

  Now, generate the order summary as a single block of text.
  `,
});

// Define the Genkit flow for summarizing the order
const summarizeOrderFlow = ai.defineFlow(
  {
    name: 'summarizeOrderFlow',
    inputSchema: SummarizeOrderInputSchema,
    outputSchema: SummarizeOrderOutputSchema,
  },
  async input => {
    const result = await summarizeOrderPrompt(input);
    // The result object contains the generated text. We must explicitly return it.
    // The 'text' property is a getter function in some versions, a property in others.
    // Calling it as a function is safer. If it's just a property, it should still work.
    // If it is genkit 1.x, it's a property.
    return result.text;
  }
);
