
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Wallet } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const registerFormSchema = z.object({
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
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


export function RegisterForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      phone: '',
      walletAddress: '',
    },
  });

  const handleSubmit = (values: RegisterFormValues) => {
    setLoading(true);
    setTimeout(() => {
        // TODO: Add actual registration logic
        console.log(values);

        toast({
        title: 'Success!',
        description: 'Your phone number has been registered.',
        variant: 'success',
        });
        setLoading(false);
        form.reset();
    }, 2000);
  };

  if (loading) {
    return <RegisterFormSkeleton />;
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex justify-center">
                <Button variant="outline" className="w-full" type="button">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
                </Button>
            </div>
            
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Your Phone Number</FormLabel>
                    <FormControl>
                    <Input type="tel" placeholder="+1 (555) 987-6543" {...field} />
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
                    <FormControl>
                    <Input placeholder="Connect wallet or paste address" {...field} />
                    </FormControl>
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
