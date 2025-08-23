
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Wallet } from 'lucide-react';
import { useState } from 'react';

export function RegisterForm() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = () => {
    // This is a mock connection
    const mockAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setWalletAddress(mockAddress);
    setIsConnected(true);
  };

  return (
    <>
      <div className="flex justify-center mb-6">
        <Button onClick={connectWallet} variant="outline" className="w-full" disabled={isConnected}>
          <Wallet className="mr-2 h-4 w-4" />
          {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="register-phone">Your Phone Number</Label>
          <Input id="register-phone" name="phone" type="tel" placeholder="+1 (555) 987-6543" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="walletAddress">Wallet Address</Label>
          <Input id="walletAddress" name="walletAddress" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Connect wallet or paste address" />
        </div>
        <Button type="submit" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Register Phone
        </Button>
      </div>
    </>
  );
}
