
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Wallet, Copy, CheckCircle, PartyPopper } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PhoneInput } from '../ui/phone-input';
import { OtpForm } from './otp-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const registerFormSchema = z.object({
    phone: z.string().refine(value => {
        const parts = value.split(' ');
        if (parts.length < 2) return false;
        const number = parts.slice(1).join('');
        return /^\d{7,15}$/.test(number);
    }, { message: "Please enter a valid phone number." }),
    walletAddress: z.string().min(1, { message: "Wallet address cannot be empty." }),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;


function RegisterFormSkeleton() {
  return (
    <div className="space-y-6">
        <Skeleton className="h-11 w-full" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
    </div>
  )
}

function SuccessScreen({ onDone }: { onDone: () => void }) {
    return (
        <Card className="w-full border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                 <div className="p-3 bg-green-500/10 rounded-full">
                    <PartyPopper className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Registration Complete!</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Your phone number has been successfully verified and linked to your wallet address.
                </CardDescription>
                <Button onClick={onDone} className="w-full" size="lg">
                    Done
                </Button>
            </CardContent>
        </Card>
    )
}


export function RegisterForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      phone: '',
      walletAddress: '',
    },
  });

  const handleCopy = () => {
    const walletAddress = form.getValues("walletAddress");
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const handleSubmit = (values: RegisterFormValues) => {
    setLoading(true);
    setTimeout(() => {
        // TODO: Add actual registration logic to send OTP
        console.log(values);

        toast({
            title: 'OTP Sent!',
            description: 'A verification code has been sent to your phone.',
            variant: 'success',
        });
        setPhoneNumber(values.phone);
        setLoading(false);
        setShowOtpForm(true);
    }, 2000);
  };

  const handleOtpSuccess = () => {
    setShowOtpForm(false);
    setShowSuccessScreen(true);
  }

  const handleDone = () => {
    setShowSuccessScreen(false);
    form.reset();
  }

  if (loading) {
    return <RegisterFormSkeleton />;
  }

  if (showSuccessScreen) {
    return <SuccessScreen onDone={handleDone} />;
  }

  if (showOtpForm) {
    return <OtpForm phone={phoneNumber} onSuccess={handleOtpSuccess} />;
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex justify-center">
                <Button variant="outline" className="w-full" type="button">
                <Wallet className="mr-2 h-4 w-4" />
                Link Wallet
                </Button>
            </div>
            
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
            <FormField
                control={form.control}
                name="walletAddress"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <div className="relative">
                        <FormControl>
                            <Input placeholder="Connect wallet or paste address" {...field} className="pr-10" />
                        </FormControl>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full px-3"
                            onClick={handleCopy}
                            disabled={!field.value}
                            aria-label="Copy wallet address"
                        >
                            <Copy className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Register Phone
            </Button>
        </form>
    </Form>

  );
}
