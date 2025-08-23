
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = formData.get('phone');
    const amount = formData.get('amount');

    if (!phone || !amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
        // TODO: Add actual send logic
        console.log({ phone, amount });

        toast({
        title: 'Payment Sent!',
        description: `Successfully sent ${amount} ETH to ${phone}.`,
        variant: 'success',
        });
        setLoading(false);
    }, 2000);
  };

  if (loading) {
      return <SendFormSkeleton />;
  }


  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="send-phone">Recipient's Phone Number</Label>
        <Input id="send-phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (ETH)</Label>
        <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.1" />
      </div>
      <Button type="submit" className="w-full">
        <Send className="mr-2 h-4 w-4" />
        Send Payment
      </Button>
    </form>
  );
}
