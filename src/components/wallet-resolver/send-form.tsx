
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const sendFormSchema = z.object({
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
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
  const form = useForm<SendFormValues>({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      phone: '',
      amount: 0.1,
    },
  });

  const handleSubmit = (values: SendFormValues) => {
    setLoading(true);
    setTimeout(() => {
        // TODO: Add actual send logic
        console.log(values);

        toast({
            title: 'Payment Sent!',
            description: `Successfully sent ${values.amount} ETH to ${values.phone}.`,
            variant: 'success',
        });
        setLoading(false);
        form.reset();
    }, 2000);
  };

  if (loading) {
      return <SendFormSkeleton />;
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient's Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
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
        <Button type="submit" className="w-full">
          <Send className="mr-2 h-4 w-4" />
          Send Payment
        </Button>
      </form>
    </Form>
  );
}
