
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
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
    onBack: () => void;
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

export function OtpForm({ phone, onSuccess, onBack }: OtpFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [expirationTime, setExpirationTime] = useState(300); // 5 minutes

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    let cooldownTimer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      cooldownTimer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(cooldownTimer);
  }, [resendCooldown]);

  useEffect(() => {
    let expirationTimer: NodeJS.Timeout;
    if (expirationTime > 0) {
      expirationTimer = setTimeout(() => setExpirationTime(expirationTime - 1), 1000);
    } else {
        toast({
            variant: 'destructive',
            title: 'OTP Expired',
            description: 'Your verification code has expired. Please request a new one.'
        })
    }
    return () => clearTimeout(expirationTimer);
  }, [expirationTime, toast]);

  const handleResend = () => {
    // TODO: Add actual resend logic here
    console.log("Resending OTP to", phone);
    toast({
        title: 'OTP Resent!',
        description: `A new code has been sent to ${phone}.`,
        variant: 'success',
    });
    setResendCooldown(30);
    setExpirationTime(300);
  };

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

  const isExpired = expirationTime === 0;
  const minutes = Math.floor(expirationTime / 60);
  const seconds = expirationTime % 60;


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
                <InputOTP maxLength={6} {...field} disabled={isExpired}>
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
         <div className="text-center text-sm text-muted-foreground">
          {isExpired ? (
            <span className="text-destructive flex items-center justify-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Code has expired. Please request a new one.
            </span>
          ) : (
            `Code expires in ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isExpired}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Verify
        </Button>

        <div className="text-center space-y-2">
             <Button
              variant="link"
              type="button"
              size="sm"
              onClick={handleResend}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0
                ? `Didn't receive a code? Resend in ${resendCooldown}s`
                : "Didn't receive a code? Resend"}
            </Button>
            <Button
              variant="ghost"
              type="button"
              size="sm"
              className="flex items-center gap-2 mx-auto"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Change phone number
            </Button>
        </div>
      </form>
    </Form>
  );
}
