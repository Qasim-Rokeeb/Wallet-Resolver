
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Wallet } from 'lucide-react';

export function RegisterForm() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = formData.get('phone');
    const walletAddress = formData.get('walletAddress');

    if (!phone || !walletAddress) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // TODO: Add actual registration logic
    console.log({ phone, walletAddress });

    toast({
      title: 'Success!',
      description: 'Your phone number has been registered.',
      variant: 'success',
    });
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center mb-6">
        <Button variant="outline" className="w-full" type="button">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="register-phone">Your Phone Number</Label>
          <Input id="register-phone" name="phone" type="tel" placeholder="+1 (555) 987-6543" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="walletAddress">Wallet Address</Label>
          <Input id="walletAddress" name="walletAddress" placeholder="Connect wallet or paste address" />
        </div>
        <Button type="submit" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Register Phone
        </Button>
      </div>
    </form>
  );
}
