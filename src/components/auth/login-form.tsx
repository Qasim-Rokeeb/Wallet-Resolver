
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogIn, CheckCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PhoneInput } from '../ui/phone-input';
import { OtpForm } from '../wallet-resolver/otp-form';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/wallet-context';
import { usePhoneVerification } from '@/context/phone-verification-context';

const loginFormSchema = z.object({
    phone: z.string().refine(value => {
        const parts = value.split(' ');
        if (parts.length < 2) return false;
        const number = parts.slice(1).join('');
        return /^\d{7,15}$/.test(number);
    }, { message: "Please enter a valid phone number." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { login } = useAuth();
  const { connectWallet } = useWallet();
  const { verifyPhone } = usePhoneVerification();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: '',
    },
  });

  const handleSubmit = (values: LoginFormValues) => {
    setLoading(true);
    setTimeout(() => {
        console.log("Sending OTP to", values.phone);
        toast({
            title: 'OTP Sent!',
            description: 'A verification code has been sent to your phone.',
            variant: 'success',
        });
        setPhoneNumber(values.phone);
        setLoading(false);
        setShowOtpForm(true);
    }, 1500);
  };

  const handleOtpSuccess = () => {
    toast({
      variant: 'success',
      title: 'Login Successful!',
      description: 'You have been successfully logged in.',
    });
    
    // In a real app, you'd get this from your backend after login
    const mockWalletAddress = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    login(phoneNumber);
    connectWallet(mockWalletAddress);
    verifyPhone(); // Assume phone is verified on login
    
    setShowOtpForm(false);
    router.push('/dashboard');
  };

  if (showOtpForm) {
    return <OtpForm phone={phoneNumber} onSuccess={handleOtpSuccess} />;
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Your Phone Number</FormLabel>
                    <FormControl>
                    <PhoneInput {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : <><LogIn className="mr-2 h-4 w-4" /> Send OTP</>}
            </Button>
        </form>
    </Form>
  );
}
