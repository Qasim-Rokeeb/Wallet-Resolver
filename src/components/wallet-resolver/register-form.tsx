
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Wallet } from 'lucide-react';

export function RegisterForm() {
  return (
    <>
      <div className="flex justify-center mb-6">
        <Button variant="outline" className="w-full">
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
    </>
  );
}
