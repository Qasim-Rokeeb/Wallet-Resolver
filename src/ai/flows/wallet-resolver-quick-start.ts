'use server';
/**
 * @fileOverview An AI agent that provides a quick start guide for using the wallet resolver application.
 *
 * - walletResolverQuickStart - A function that generates a quick start guide for the wallet resolver application.
 * - WalletResolverQuickStartInput - The input type for the walletResolverQuickStart function.
 * - WalletResolverQuickStartOutput - The return type for the walletResolverQuickStart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WalletResolverQuickStartInputSchema = z.object({
  task: z.enum(['add', 'resolve']).describe('The task for which to generate a quick start guide: add or resolve a wallet.')
});
export type WalletResolverQuickStartInput = z.infer<typeof WalletResolverQuickStartInputSchema>;

const WalletResolverQuickStartOutputSchema = z.object({
  guide: z.string().describe('A quick start guide for the specified task.')
});
export type WalletResolverQuickStartOutput = z.infer<typeof WalletResolverQuickStartOutputSchema>;

export async function walletResolverQuickStart(input: WalletResolverQuickStartInput): Promise<WalletResolverQuickStartOutput> {
  return walletResolverQuickStartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'walletResolverQuickStartPrompt',
  input: {schema: WalletResolverQuickStartInputSchema},
  output: {schema: WalletResolverQuickStartOutputSchema},
  prompt: `You are an AI assistant that helps new users understand how to use the Wallet Resolver application.

  Generate a quick start guide for the following task: {{{task}}}

  The guide should be concise and easy to understand. Focus on the essential steps.
  The user interface style is:
  - Primary color: Deep blue (#3F51B5) to convey trust and security.
  - Background color: Light gray (#F5F5F5), near white, for a clean interface.
  - Accent color: Teal (#009688) for interactive elements and highlights to maintain visual interest.
  - Body and headline font: 'Inter', a grotesque-style sans-serif for a modern, neutral, clean feel.
  - Use outline-style icons related to phone numbers, wallets, and transactions for clarity and modern style.
  - Keep the layout clean and straightforward with a focus on ease of use. Payment form should be prominent and intuitive.
  - Subtle animations during transaction processing to provide feedback to the user (e.g., loading indicators, confirmations).
`
});

const walletResolverQuickStartFlow = ai.defineFlow(
  {
    name: 'walletResolverQuickStartFlow',
    inputSchema: WalletResolverQuickStartInputSchema,
    outputSchema: WalletResolverQuickStartOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
