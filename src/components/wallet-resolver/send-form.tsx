
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send, Info, Fuel, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PhoneInput } from '../ui/phone-input';
import { useTransaction } from '@/context/transaction-context';
import { Separator } from '../ui/separator';

const sendFormSchema = z.object({
  phone: z.string().refine(value => {
        const parts = value.split(' ');
        if (parts.length < 2) return false;
        const number = parts.slice(1).join('');
        return /^\d{7,15}$/.test(number);
    }, { message: "Please enter a valid phone number." }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
});

type SendFormValues = z.infer<typeof sendFormSchema>;


function SendFormSkeleton() {
    return (
        <div className="space-y-6">
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

export function SendForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { recordTransaction } = useTransaction();
  const [gasFee, setGasFee] = useState<number | null>(null);
  const [isFetchingGas, setIsFetchingGas] = useState(false);

  const form = useForm<SendFormValues>({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      phone: '',
      amount: undefined,
    },
  });

  const amount = form.watch("amount");

  useEffect(() => {
    const fetchGasFee = () => {
      if (amount && amount > 0) {
        setIsFetchingGas(true);
        setGasFee(null);
        setTimeout(() => {
          // Simulate fetching gas fee, e.g., a small percentage of the amount
          const fee = Math.random() * 0.001;
          setGasFee(fee);
          setIsFetchingGas(false);
        }, 1000);
      } else {
        setGasFee(null);
      }
    };
    
    const debounce = setTimeout(fetchGasFee, 500);
    return () => clearTimeout(debounce);
  }, [amount]);


  const handleSubmit = (values: SendFormValues) => {
    setLoading(true);
    setIsAlertOpen(false);
    setTimeout(() => {
        // TODO: Add actual send logic
        console.log(values);

        toast({
            title: 'Payment Sent!',
            description: `Successfully sent ${values.amount} ETH to ${values.phone}.`,
            variant: 'success',
        });
        recordTransaction();
        setLoading(false);
        form.reset();
    }, 2000);
  };

  if (loading) {
      return <SendFormSkeleton />;
  }

  const totalAmount = (amount || 0) + (gasFee || 0);

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Recipient's Phone Number</FormLabel>
              </div>
              <FormControl>
                <PhoneInput placeholder="555 123 4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (ETH)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(isFetchingGas || gasFee) && (
            <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Fuel className="h-4 w-4" />
                        <span>Est. Gas Fee</span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Info className="h-4 w-4 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>A network fee required for the transaction.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    {isFetchingGas ? (
                        <Skeleton className="h-5 w-16" />
                    ) : (
                        <span className="font-medium text-foreground">{gasFee?.toFixed(6)} ETH</span>
                    )}
                </div>
                <Separator />
                 <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    {isFetchingGas ? (
                        <Skeleton className="h-5 w-24" />
                    ) : (
                        <span>{totalAmount.toFixed(6)} ETH</span>
                    )}
                </div>
            </div>
        )}

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <Button type="button" className="w-full" onClick={() => form.trigger().then(isValid => isValid && setIsAlertOpen(true))}>
              <Send className="mr-2 h-4 w-4" />
              Send Payment
            </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to send a total of <strong className='text-foreground'>{totalAmount.toFixed(6)} ETH</strong> to <strong className='text-foreground'>{form.getValues().phone}</strong>. This includes an estimated gas fee of {gasFee?.toFixed(6)} ETH. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => form.handleSubmit(handleSubmit)()}>
                {loading ? <Loader2 className="animate-spin" /> : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
}
