
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Skeleton } from '../ui/skeleton';

const otpFormSchema = z.object({
  otp: z.string().min(6, { message: "Your one-time password must be 6 characters." }),
});

type OtpFormValues = z.infer<typeof otpFormSchema>;

interface OtpFormProps {
    phone: string;
    onSuccess: () => void;
}

function OtpFormSkeleton() {
    return (
        <div className="space-y-6 flex flex-col items-center">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-4 w-1/3" />
        </div>
    )
}

export function OtpForm({ phone, onSuccess }: OtpFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleSubmit = (values: OtpFormValues) => {
    setLoading(true);
    setTimeout(() => {
        // TODO: Add actual OTP verification logic
        console.log(values);

        if (values.otp === "123456") { // Mock success
            onSuccess();
        } else {
             toast({
                title: 'Invalid OTP',
                description: 'The code you entered is incorrect. Please try again.',
                variant: 'destructive',
            });
        }
        setLoading(false);
    }, 2000);
  };
  
  if (loading) {
    return <OtpFormSkeleton />;
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="text-center">
            <h3 className="text-xl font-semibold">Enter Verification Code</h3>
            <p className="text-sm text-muted-foreground mt-1">
                A 6-digit code was sent to {phone}
            </p>
        </div>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel className="sr-only">One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          <CheckCircle className="mr-2 h-4 w-4" />
          Verify
        </Button>

        <div className="text-center">
            <Button variant="link" type="button" size="sm">
                Didn't receive a code? Resend
            </Button>
        </div>
      </form>
    </Form>
  );
}

