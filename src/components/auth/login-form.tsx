
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Fingerprint } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PhoneInput } from '../ui/phone-input';
import { OtpForm } from '../wallet-resolver/otp-form';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/wallet-context';
import { usePhoneVerification } from '@/context/phone-verification-context';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';

const loginFormSchema = z.object({
    phone: z.string().refine(value => {
        const parts = value.split(' ');
        if (parts.length < 2) return false;
        const number = parts.slice(1).join('');
        return /^\d{7,15}$/.test(number);
    }, { message: "Please enter a valid phone number." }),
    rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [formData, setFormData] = useState<LoginFormValues | null>(null);
  const { login } = useAuth();
  const { connectWallet } = useWallet();
  const { verifyPhone } = usePhoneVerification();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: '',
      rememberMe: true,
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
        setFormData(values);
        setLoading(false);
        setShowOtpForm(true);
    }, 1500);
  };

  const handleOtpSuccess = () => {
    if (!formData) return;

    toast({
      variant: 'success',
      title: 'Login Successful!',
      description: 'You have been successfully logged in.',
    });
    
    // In a real app, you'd get this from your backend after login
    const mockWalletAddress = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    login(formData.phone, formData.rememberMe);
    connectWallet(mockWalletAddress);
    verifyPhone(); // Assume phone is verified on login
    
    setShowOtpForm(false);
    router.push('/dashboard');
  };

  const handleBiometricClick = () => {
    toast({
        title: 'Coming Soon!',
        description: 'Biometric login is a future feature.',
        variant: 'info'
    });
  }

  const handleOtpBack = () => {
    setShowOtpForm(false);
    setFormData(null);
  }

  if (showOtpForm && formData) {
    return <OtpForm phone={formData.phone} onSuccess={handleOtpSuccess} onBack={handleOtpBack} />;
  }

  return (
    <div className="space-y-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                    name="rememberMe"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Remember me
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : <><LogIn className="mr-2 h-4 w-4" /> Send OTP</>}
                </Button>
            </form>
        </Form>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or
                </span>
            </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleBiometricClick}>
            <Fingerprint className="mr-2 h-4 w-4" />
            Sign in with biometrics
        </Button>
    </div>
  );
}
