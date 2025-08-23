
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Wallet, Copy } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PhoneInput } from '../ui/phone-input';
import { OtpForm } from './otp-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { WalletConnectModal } from './wallet-connect-modal';
import { useWallet } from '@/context/wallet-context';
import { usePhoneVerification } from '@/context/phone-verification-context';

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
                 <div className="h-24 w-24">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 52 52"
                    >
                        <circle
                            className="text-green-500/20 stroke-current"
                            cx="26"
                            cy="26"
                            r="25"
                            fill="none"
                        />
                        <circle
                            className="text-green-600 stroke-current animate-checkmark-circle"
                            strokeLinecap="round"
                            cx="26"
                            cy="26"
                            r="25"
                            fill="none"
                        />
                        <path
                            className="text-green-600 stroke-current animate-checkmark-check"
                            fill="none"
                            strokeLinecap="round"
                            strokeMiterlimit="10"
                            d="M14 27l5.917 5.917L38 20"
                        />
                    </svg>
                </div>
                <CardTitle className="text-2xl pt-2">Registration Complete!</CardTitle>
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
  const { walletAddress, connectWallet } = useWallet();
  const { verifyPhone } = usePhoneVerification();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      phone: '',
      walletAddress: walletAddress || '',
    },
  });

  useEffect(() => {
    if (walletAddress) {
        form.setValue('walletAddress', walletAddress, { shouldValidate: true });
    } else {
        form.setValue('walletAddress', '', { shouldValidate: true });
    }
  }, [walletAddress, form])
  
  const handleWalletLinked = (address: string) => {
    connectWallet(address);
    form.setValue('walletAddress', address, { shouldValidate: true });
  }

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
    verifyPhone();
    setShowOtpForm(false);
    setShowSuccessScreen(true);
  }

  const handleOtpBack = () => {
    setShowOtpForm(false);
    setPhoneNumber('');
  }

  const handleDone = () => {
    setShowSuccessScreen(false);
    form.reset({ phone: '', walletAddress: walletAddress || ''});
  }

  if (loading) {
    return <RegisterFormSkeleton />;
  }

  if (showSuccessScreen) {
    return <SuccessScreen onDone={handleDone} />;
  }

  if (showOtpForm) {
    return <OtpForm phone={phoneNumber} onSuccess={handleOtpSuccess} onBack={handleOtpBack} />;
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {!walletAddress && (
                <WalletConnectModal onConnect={handleWalletLinked}>
                    <Button variant="outline" className="w-full" type="button">
                        <Wallet className="mr-2 h-4 w-4" />
                        Link Wallet
                    </Button>
                </WalletConnectModal>
            )}
            
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Your Phone Number</FormLabel>
                    <FormControl>
                    <PhoneInput placeholder="555 123 4567" {...field} />
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
                            <Input placeholder="Link your wallet or paste an address, e.g., 0x..." {...field} className="pr-10" />
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
