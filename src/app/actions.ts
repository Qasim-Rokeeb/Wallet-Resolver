'use server';

import { walletResolverQuickStart } from '@/ai/flows/wallet-resolver-quick-start';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// In-memory store for demonstration purposes
// In a real app, this would be a secure database like PostgreSQL or MongoDB
const walletDB = new Map<string, string>();
// Add a pre-registered user for demonstration purposes
walletDB.set('+15551234567', '0xAbC123dEaFBCAdeaBc123DeAFbCADeaBC123dEaF');

const phoneSchema = z.string().min(10, 'Please enter a valid phone number including country code.');
const walletAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Please enter a valid Ethereum wallet address.');
const amountSchema = z.coerce.number().positive('Amount must be a positive number.');

type FormState = {
  message: string | null;
  status: 'success' | 'error' | 'escrow' | null;
  errors?: {
    phone?: string[];
    walletAddress?: string[];
    amount?: string[];
  } | null;
}

export async function register(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawFormData = {
    phone: formData.get('phone'),
    walletAddress: formData.get('walletAddress'),
  };

  const validatedFields = z.object({
    phone: phoneSchema,
    walletAddress: walletAddressSchema,
  }).safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Invalid data. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      status: 'error',
    };
  }
  
  const { phone, walletAddress } = validatedFields.data;

  // In a real app, you would hash and salt the phone number before storing
  const phoneKey = phone; 

  walletDB.set(phoneKey, walletAddress);

  revalidatePath('/');
  return {
    message: `Successfully registered ${phone} to ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}.`,
    status: 'success',
  };
}

export async function send(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawFormData = {
    phone: formData.get('phone'),
    amount: formData.get('amount'),
  };

  const validatedFields = z.object({
    phone: phoneSchema,
    amount: amountSchema,
  }).safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Invalid data. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      status: 'error',
    };
  }

  const { phone, amount } = validatedFields.data;
  // In a real app, you would hash and salt the phone number before lookup
  const phoneKey = phone;
  
  // Simulate network delay and blockchain processing time
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  if (walletDB.has(phoneKey)) {
    const walletAddress = walletDB.get(phoneKey);
    // In a real app, you would call your smart contract here
    return {
      message: `Successfully sent ${amount} ETH to ${phone} (wallet: ${walletAddress?.substring(0, 6)}...).`,
      status: 'success',
    };
  } else {
    // Escrow functionality simulation
    return {
      message: `User ${phone} is not registered. Funds will be held in escrow until they sign up.`,
      status: 'escrow',
    };
  }
}

export async function getAIGuide(task: 'add' | 'resolve') {
  try {
    const output = await walletResolverQuickStart({ task });
    return output;
  } catch (error) {
    console.error('AI Guide Error:', error);
    throw new Error('Failed to generate AI guide. Please try again later.');
  }
}
